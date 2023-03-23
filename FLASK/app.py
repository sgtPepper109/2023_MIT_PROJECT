import requests
from flask import Flask, make_response, request
from flask_cors import CORS
import logging
import pickle

import json
import config

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import scipy
from scipy.stats import skew, kurtosis
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso, BayesianRidge
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_squared_error
import sklearn.metrics as metrics
from sklearn.mixture import GaussianMixture
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.stats.stattools import jarque_bera, durbin_watson
import statsmodels.api as sm

app = Flask(__name__)
cors = CORS(app)

trainRatio = 0
valRatio = 0
dataset = ""


@app.route("/getCsvData")
def getCsvData():
    success = True
    url = config.springUrl + '/process/exchangeCsvData'
    try:
        uResponse = requests.get(url)
    except:
        success = False
        return {getCsvData: "Connection Error"}
    
    JResponse = uResponse.text
    csvData = json.loads(JResponse)

    global df
    global tempdf
    global uniqueJunctionsInDataset
    global typeOfData

    df = pd.DataFrame()
    tempdf = pd.DataFrame()

    df = pd.DataFrame.from_dict(csvData)
    df = df._convert(numeric=True)
    if 'ID' in df.columns:
        df.drop('ID', axis=1, inplace=True)

    tempdf = df.copy()

    tempdf['DateTime'] = pd.to_datetime(tempdf['DateTime'])
    tempdf = tempdf.set_index('DateTime')

    timeDifference = tempdf.index[1] - tempdf.index[0]
    timeDifference = str(timeDifference)
    timeDifference = int(timeDifference.split(' ')[0])

    if timeDifference == 0:
        typeOfData = 'Hourly'
    elif timeDifference == 1:
        typeOfData = 'Daily'
    elif timeDifference == 30:
        typeOfData = 'Monthly'

    tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
    tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
    tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
    tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()
    
    if 'ID' in tempdf.columns:
        tempdf.drop('ID', axis=1, inplace=True)


    uniqueJunctionsInDataset = list(np.unique(df.Junction))

    dictionary = dict()
    if success:
        dictionary['getCsvData'] = "success"
        return make_response(dictionary)
    else:
        dictionary['getCsvData'] = "fail"
        return make_response(dictionary)


@app.route('/getAllUniqueJunctions')
def getAllUniqueJunctions():
    global uniqueJunctionsInDataset
    return make_response(uniqueJunctionsInDataset)


def createDict(junction):
    global df
    data = df[df['Junction'] == junction]
    vehicles = list(data['Vehicles'])
    datetime = list(data['DateTime'])
    dictionary = dict()
    dictionary['vehicles'] = vehicles
    dictionary['datetime'] = datetime
    return [dictionary]



@app.route("/plot")
def plot():
    global df
    global tempdf

    response = dict()
    for i in np.unique(df.Junction):
        response[i] = createDict(i)
    # print('plot', response)
    return make_response(response)



def f_test(x, y):
    x = np.array(x)
    y = np.array(y)
    f = np.var(x, ddof=1)/np.var(y, ddof=1) #calculate F test statistic 
    dfn = x.size-1 #define degrees of freedom numerator 
    dfd = y.size-1 #define degrees of freedom denominator 
    p = 1- scipy.stats.f.cdf(f, dfn, dfd) #find p-value of F test statistic 
    return f, p



class Train:
    def __init__(self, data, algorithm, junction, testSize):
        #constructor
        self.trained = False
        self.data = data
        self.algorithm = algorithm
        self.junction = junction
        self.testSize = testSize
        self.startTrainingProcess()
    
    def startTrainingProcess(self):
        self.preprocessData()
        self.splitData()
        self.training()
        self.actualVsPredicted()
    
    def preprocessData(self):
        # drop all null value records
        self.separateJunctionRelatedData()
        self.junctionData = self.junctionData.dropna()

    def separateJunctionRelatedData(self):
        self.junctionData = self.data[self.data.Junction == self.junction]
        self.junctionData = self.junctionData.drop(['Junction'], axis='columns')

    def splitData(self):
        self.x = self.junctionData.drop(['Vehicles'], axis='columns')
        self.y = self.junctionData.Vehicles
        self.xtrain, self.xtest, self.ytrain, self.ytest = train_test_split(self.x, self.y, test_size = self.testSize)

    def training(self):
        if self.algorithm == "Random Forest Regression":
            self.model = RandomForestRegressor()
        elif self.algorithm == "Gradient Boosting Regression":
            self.model = GradientBoostingRegressor()
        elif self.algorithm == "Linear Regression":
            self.model = LinearRegression()
        elif self.algorithm == "Logistic Regression":
            self.model = LogisticRegression()
        elif self.algorithm == "Ridge Regression":
            self.model = Ridge(alpha=1.0)
        elif self.algorithm == "Lasso Regression":
            self.model = Lasso(alpha=1.0)
        elif self.algorithm == "Bayesian Ridge Regression":
            self.model = BayesianRidge()

        self.model.fit(self.xtrain, self.ytrain)
        self.trained = True
        self.whenTrained = datetime.now()


    def actualVsPredicted(self):
        self.xtestIndex = list(self.xtest.index)
        self.xtestIndex.sort()
        self.newXtest = pd.DataFrame()
        
        self.years = list()
        self.months = list()
        self.days = list()
        self.hours = list()
        self.dateTime = list()
        
        for i in self.xtestIndex:
            self.dateTime.append(i)
            self.years.append(i.year)
            self.months.append(i.month)
            self.days.append(i.day)
            self.hours.append(i.hour)

        self.newXtest['Year'] = self.years
        self.newXtest['Month'] = self.months
        self.newXtest['Day'] = self.days
        self.newXtest['Hour'] = self.hours
        self.newXtest['DateTime'] = self.dateTime
        self.newXtest.index = self.newXtest['DateTime']
        self.newXtest = self.newXtest.drop(['DateTime'], axis='columns')

        self.newYtest = list()
        for i in self.newXtest.index:
            self.newYtest.append(self.ytest[i])        

        self.newYtest = pd.Series(self.newYtest)
        self.newYtest.index = self.newXtest.index

        self.actual = self.newYtest
        self.predicted = self.model.predict(self.newXtest)
        self.actual = list(self.actual)
        self.predicted = list(self.predicted)

        self.difference = list()
        for i in range(len(self.actual)):
            self.difference.append(abs(self.actual[i] - self.predicted[i]))

        self.accuracyScore = self.model.score(self.newXtest, self.newYtest)
        self.r2 = r2_score(self.newYtest, self.predicted)
        self.explaindVariance = metrics.explained_variance_score(self.newYtest, self.predicted)
        self.meanAbsoluteError = metrics.mean_absolute_error(self.newYtest, self.predicted)
        self.meanSquaredError = metrics.mean_squared_error(self.newYtest, self.predicted)
        self.medianAbsoluteError = metrics.median_absolute_error(self.newYtest, self.predicted)
        self.testAgainst = []
        for i in self.newXtest.index:
            self.testAgainst.append(str(i))
        

    def constructFutureTimeToBePredicted(self, timePeriod, timeFormat, typeOfData: str):
        self.currTime = self.junctionData.tail(1).index[0]
        
        if timeFormat == "Days":
            self.endTime = self.currTime + pd.DateOffset(days=timePeriod) 
        elif timeFormat == "Months":
            self.endTime = self.currTime + pd.DateOffset(months=timePeriod) 
        else:
            self.endTime = self.currTime + pd.DateOffset(years=timePeriod) 

        self.time = list()
        while self.currTime != self.endTime:
            self.time.append(self.currTime)
            if typeOfData == 'Hourly':
                self.currTime += timedelta(minutes=60)
            if typeOfData == 'Daily':
                self.currTime += timedelta(minutes=1440)
            if typeOfData == 'Monthly':
                self.currTime += timedelta(minutes=43200)

    def constructFutureDataToBePredicted(self):
        self.toPredict = pd.DataFrame()
        self.years = list()
        self.months = list()
        self.days = list()
        self.hours = list()
        self.dateTime = list()
        
        for i in self.time:
            self.dateTime.append(i)
            self.years.append(i.year)
            self.months.append(i.month)
            self.days.append(i.day)
            self.hours.append(i.hour)

        self.toPredict['Year'] = self.years
        self.toPredict['Month'] = self.months
        self.toPredict['Day'] = self.days
        self.toPredict['Hour'] = self.hours
        self.toPredict['DateTime'] = self.dateTime
        self.toPredict.index = self.toPredict['DateTime']
        self.toPredict = self.toPredict.drop(['DateTime'], axis='columns')


    def predict(self, timePeriod, timeFormat, typeOfData):

        # returns predicted data for given timePeriod and timeFormat (e.g. 2, 'Days')

        if self.trained:
            self.constructFutureTimeToBePredicted(timePeriod, timeFormat, typeOfData)
            self.constructFutureDataToBePredicted()

            self.futureDatesPredicted = self.model.predict(self.toPredict)  # toPredict variable comes from data constructed
            self.tableData = self.toPredict.copy()

            self.columnDateTime = list()
            for i in self.dateTime:
                self.columnDateTime.append(str(i))

            self.tableData['DateTime'] = self.columnDateTime
            self.tableData = self.tableData.reset_index(drop=True)
            self.tableData['Vehicles'] = list(self.futureDatesPredicted)

            self.predictedData = dict()
            self.predictedData['vehicles'] = list(self.futureDatesPredicted)

            self.toPredictDateTime = list()
            for i in self.toPredict.index:
                self.toPredictDateTime.append(str(i))
            self.predictedData['datetime'] = self.toPredictDateTime

            return [self.predictedData]




@app.route('/getAllModelSummaries')
def getAllModelSummaries():
    global allTrainedData

    allModelSummaries = dict()
    for algorithm in allTrainedData[junction]:
        modelSummaryOfTestRatios = dict()
        for testRatio in allTrainedData[junction][algorithm]:
            trained = allTrainedData[junction][algorithm][testRatio]
            fstatistic = f_test(trained.newYtest, trained.predicted)
            modelSummary = [ { 'Property': 'Dependent Variable', 'Value': 'Vehicles' },
                { 'Property': 'Algorithm', 'Value': trained.algorithm },
                { 'Property': 'Accuracy', 'Value': trained.accuracyScore },
                { 'Property': 'R-Squared', 'Value': trained.r2 },
                { 'Property': 'Date & Time of Training', 'Value': trained.whenTrained },
                { 'Property': 'No. of Observations', 'Value': trained.data.shape[0] },
                { 'Property': 'F-Statistic', 'Value': fstatistic[0] },
                { 'Property': '(prob) F-Statistic', 'Value': fstatistic[1] },
                { 'Property': 'Explained Variance', 'Value': trained.explaindVariance },
                { 'Property': 'Mean Absolute Error', 'Value': trained.meanAbsoluteError },
                { 'Property': 'Mean Squared Error', 'Value': trained.meanSquaredError },
                { 'Property': 'Median Absolute Error', 'Value': trained.medianAbsoluteError },
                { 'Property': 'Skew', 'Value': skew(list(trained.data.Vehicles), axis=0, bias=True) },
                { 'Property': 'Kurtosis', 'Value': kurtosis(list(trained.data.Vehicles), axis=0, bias=True) },
                { 'Property': 'Jarque-Bera (JB)', 'Value': str(jarque_bera(np.array(trained.data.Vehicles))) },
                { 'Property': 'Durbin Watson', 'Value': durbin_watson(np.array(trained.data.Vehicles)) }
            ]
            modelSummaryOfTestRatios[testRatio] = modelSummary
        allModelSummaries[algorithm] = modelSummaryOfTestRatios

    return make_response(allModelSummaries)



@app.route('/getModelSummary')
def getModelSummary():
    global trainedAlgorithms

    modelSummaries = dict()
    for i in trainedAlgorithms:
        trained = trainedAlgorithms[i]
        fstatistic = f_test(trained.newYtest, trained.predicted)
        modelSummary = [ { 'Property': 'Dependent Variable', 'Value': 'Vehicles' },
            { 'Property': 'Algorithm', 'Value': trained.algorithm },
            { 'Property': 'Accuracy', 'Value': trained.accuracyScore },
            { 'Property': 'R-Squared', 'Value': trained.r2 },
            { 'Property': 'Date & Time of Training', 'Value': trained.whenTrained },
            { 'Property': 'No. of Observations', 'Value': trained.data.shape[0] },
            { 'Property': 'F-Statistic', 'Value': fstatistic[0] },
            { 'Property': '(prob) F-Statistic', 'Value': fstatistic[1] },
            { 'Property': 'Explained Variance', 'Value': trained.explaindVariance },
            { 'Property': 'Mean Absolute Error', 'Value': trained.meanAbsoluteError },
            { 'Property': 'Mean Squared Error', 'Value': trained.meanSquaredError },
            { 'Property': 'Median Absolute Error', 'Value': trained.medianAbsoluteError },
            { 'Property': 'Skew', 'Value': skew(list(trained.data.Vehicles), axis=0, bias=True) },
            { 'Property': 'Kurtosis', 'Value': kurtosis(list(trained.data.Vehicles), axis=0, bias=True) },
            { 'Property': 'Jarque-Bera (JB)', 'Value': str(jarque_bera(np.array(trained.data.Vehicles))) },
            { 'Property': 'Durbin Watson', 'Value': durbin_watson(np.array(trained.data.Vehicles)) }
        ]
        modelSummaries[i] = modelSummary

    return make_response(modelSummaries)




@app.route('/listenTime')
def listenTime():
    success = True
    url = config.springUrl + '/process/exchangeTime'

    try:
        uResponse = requests.get(url)
    except:
        success = False
        return "Connection Error"
    JResponse = uResponse.text
    response = json.loads(JResponse)
    global time
    global timeFormat
    time = response['timePeriod']
    timeFormat = response['timeFormat']
    dictionary = dict()
    if success:
        dictionary['gotTime'] = "success"
        return make_response(dictionary)
    else:
        dictionary['gotTime'] = "fail"
        return make_response(dictionary)


def getJunctionRelatedDataFromDB():
    global junctionDistrictMaps
    global junctionRoadwayWidthMaps
    global roadwayWidthMaxVehiclesMaps
    with app.app_context():
        url = config.springUrl + '/junctionSpecifics/junctionDistrict/getAllJunctionDistrictMaps'
        try:
            uResponse = requests.get(url)
        except:
            return "Connection Error"
        JResponse = uResponse.text
        junctionDistrictMaps = json.loads(JResponse)

        url = config.springUrl + '/junctionSpecifics/junctionRoadwayWidth/getAllJunctionRoadwayWidthMaps'
        try:
            uResponse = requests.get(url)
        except:
            return "Connection Error"
        JResponse = uResponse.text
        junctionRoadwayWidthMaps = json.loads(JResponse)

        url = config.springUrl + '/junctionSpecifics/roadwayWidthMaxVehicles/getAllRoadwayWidthMaxVehiclesMaps'
        try:
            uResponse = requests.get(url)
        except:
            return "Connection Error"
        JResponse = uResponse.text
        roadwayWidthMaxVehiclesMaps = json.loads(JResponse)

        return make_response(junctionDistrictMaps + junctionRoadwayWidthMaps + roadwayWidthMaxVehiclesMaps)



@app.route('/listenToTrainingInputs')
def listenTrainingInputs():
    success = True
    url = config.springUrl + '/process/exchangeTrainingInputs'

    try:
        uResponse = requests.get(url)
    except:
        success = False
        return "Connection Error"
    JResponse = uResponse.text
    response = json.loads(JResponse)
    global junction
    global testRatio
    global algorithm

    junction = response['junction']
    testRatio = response['testRatio']
    algorithm = response['algorithm']
    dictionary = dict()
    if success:
        dictionary['gotTrainingSpecifics'] = "success"
        return make_response(dictionary)
    else:
        dictionary['gotTrainingSpecifics'] = "fail"
        return make_response(dictionary)








@app.route('/getAccuraciesOfAllJunctions')
def getAccuraciesOfAllJunctions():
    global allJunctionsAccuracies
    return make_response(allJunctionsAccuracies)




@app.route('/getAccuracies')
def getAccuracies():
    # algorithms = ['Linear Regression', 'Random Forest Regression', 'Gradient Boosting Regression', 'Ridge Regression',
    #               'Lasso Regression', 'Bayesian Ridge Regression']
    global df
    global tempdf
    global accuraciesMap
    global trainedAlgorithms

    accuracies = list()
    # if junction not in accuraciesMap:
    #     print('not found in accuraciesMap')
    #     mainData = tempdf.copy()
    #     for algorithm in algorithms:
    #         trained = Train(mainData, algorithm, junction, testRatio)
    #         algorithmAndAccuracy = dict()
    #         algorithmAndAccuracy['algorithm'] = algorithm
    #         algorithmAndAccuracy['accuracyScore'] = trained.accuracyScore
    #         accuracies.append(algorithmAndAccuracy)
    #     accuraciesMap[junction] = accuracies
    # else:
    #     print('found in accuraciesMap')
    #     accuracies = accuraciesMap[junction]

    for i in trainedAlgorithms:
        trained = trainedAlgorithms[i]
        algorithmAndAccuracy = dict()
        algorithmAndAccuracy['algorithm'] = i
        algorithmAndAccuracy['accuracyScore'] = trained.accuracyScore
        accuracies.append(algorithmAndAccuracy)

    return make_response(accuracies)



@app.route('/predictForHighestAccuracy')
def predictForHighestAccuracy():
    args = request.args
    args = args.to_dict()

    algorithm = args['algorithm']
    if "%20" in algorithm:
        algorithm = algorithm.replace("%20", " ")
    testRatio = float(args['testRatio'])
    junction = args['junction']
    if "%20" in args['junction']:
        junction = args['junction'].replace("%20", " ")

    global allTrainedData
    global time
    global timeFormat
    global highestAccuracyAlgorithm
    global highestAccuracyTestRatio
    global highestAccuracyTrained
    print(junction, algorithm, testRatio, time, timeFormat)

    highestAccuracyAlgorithm = ""
    highestAccuracyTestRatio = float(0)
    highestAccuracyTrained = allTrainedData[junction][algorithm][testRatio]
    plotResponse = highestAccuracyTrained.predict(time, timeFormat, typeOfData)
    return make_response(plotResponse)
    


@app.route("/addToMaster")
def addToMaster():
    args = request.args
    args = args.to_dict()

    algorithm = args['algorithm']
    if "%20" in algorithm:
        algorithm = algorithm.replace("%20", " ")

    testRatio = float(args['testRatio'])

    global masterAlgorithmAndTestRatioForJunction
    global allTrainedData
    global masterData

    junction = args['junction']
    if "%20" in args['junction']:
        junction = args['junction'].replace("%20", " ")
    masterTrainedAlgorithmAndTestRatioForJunction = (algorithm, testRatio)
    print(algorithm, junction)

    findTrained = allTrainedData[junction][algorithm][testRatio]
    masterData[junction] = findTrained
    return make_response(args)



@app.route("/getMasterTrainedDataPlot")
def getMasterTrainedDataPlot():
    global allTrainedData
    global masterData
    global time
    global timeFormat
    global masterDataTable
    global masterJunctionsAccuracies
    print('newtime', time, timeFormat)
    
    masterDataTable = dict()
    response = dict()
    masterJunctionsAccuracies = dict()
    for i in masterData:
        trained = masterData[i]
        response[i] = trained.predict(time, timeFormat, 'Hourly')
        masterJunctionsAccuracies[i] = trained.accuracyScore

        table = []
        head = trained.tableData

        data2 = head.to_dict()
        anycol = ""
        for j in data2:
            anycol = j
            break
        for j in range(len(data2[anycol])):
            field = {}
            for k in data2:
                field[k] = data2[k][j]
            table.append(field)
        
        masterDataTable[i] = table

    return make_response(response)


@app.route("/getMasterTrainedDataTable")
def getMasterTrainedDataTable():
    global masterDataTable
    return make_response(masterDataTable)


@app.route("/getMasterTrainedJunctionsAccuracies")
def getMasterTrainedJunctionsAccuracies():
    global masterJunctionsAccuracies
    return make_response(masterJunctionsAccuracies)


@app.route('/getTestingRatioComparisons')
def getTestingRatioComparisons():
    global time
    global timeFormat
    global algorithm
    global tempdf
    global junction
    global allTrainedData

    possibleTestRatios = np.arange(0.1, 1, 0.1)

    algorithms = ['Linear Regression', 'Random Forest Regression', 'Gradient Boosting Regression', 'Ridge Regression',
                  'Lasso Regression', 'Bayesian Ridge Regression']
    response = dict()
    temp = dict()

    for i in algorithms:
        testRatioComparisons = dict()
        trainedData = dict()
        for j in possibleTestRatios:
            trained = Train(tempdf, i, junction, j)
            trainedData[j] = trained
            testRatioComparisons[j] = trained.accuracyScore
        response[i] = testRatioComparisons
        temp[i] = trainedData

    allTrainedData[junction] = temp
    
    # response = dict()
    # for i in possibleTestRatios:
    #     trained = Train(tempdf, algorithm, junction, i)
    #     response[i] = trained.accuracyScore
    return make_response(response)

@app.route('/getFuturePredictionsTable')
def getFuturePredictionsTable():
    global trainedAlgorithms
    global algorithm
    global highestAccuracyTrained
    arr = []
    head = highestAccuracyTrained.tableData

    data2 = head.to_dict()
    anycol = ""
    for i in data2:
        anycol = i
        break
    for i in range(len(data2[anycol])):
        field = {}
        for j in data2:
            field[j] = data2[j][i]
        arr.append(field)
    return make_response(arr)






@app.route('/predictAllJunctions')
def predictAllJunctions():
    global tempdf
    global testRatio
    global junction
    global algorithm
    global time
    global timeFormat
    global allJunctionsPredictedPlotData
    global allJunctionsTableData
    global allJunctionsAccuracies
    global autoTrainedModels
    allJunctionsPredictedPlotData = dict()
    allJunctionsTableData = dict()
    allJunctionsAccuracies = dict()

    junctions = np.unique(df.Junction)
    for i in autoTrainedForJunctions:
        trainedForJunction = autoTrainedModels[i]
        futurePredictionsForJunction = trainedForJunction.predict(time, timeFormat, 'Hourly')
        allJunctionsPredictedPlotData[i] = futurePredictionsForJunction
        allJunctionsAccuracies[i] = trainedForJunction.accuracyScore

        arr = []
        head = trainedForJunction.tableData

        data2 = head.to_dict()
        anycol = ""
        for j in data2:
            anycol = j
            break
        for j in range(len(data2[anycol])):
            field = {}
            for k in data2:
                field[k] = data2[k][j]
            arr.append(field)
        
        allJunctionsTableData[i] = arr

    return make_response(allJunctionsPredictedPlotData)



@app.route('/getAllJunctionsFuturePredictionsTable')
def getAllJunctionsFuturePredictions():
    global allJunctionsTableData
    return make_response(allJunctionsTableData)


@app.route('/getActualVsPredictedComparison')
def getActualVsPredictedComparison():
    global allTrainedData
    global allActualVsPredicted
    global junction

    print("junction", junction)

    allActualVsPredicted = dict()
    for algorithm in allTrainedData[junction]:
        actualVsPredictedForTestRatio = dict()
        for testRatio in allTrainedData[junction][algorithm]:
            trained = allTrainedData[junction][algorithm][testRatio]
            actualPred = dict()
            actualPred['actual'] = trained.actual
            actualPred['predicted'] = trained.predicted
            actualPred['difference'] = trained.difference
            actualPred['labels'] = trained.testAgainst
            actualVsPredictedForTestRatio[testRatio] = actualPred
        allActualVsPredicted[algorithm] = actualVsPredictedForTestRatio
    
    return make_response(allActualVsPredicted)



@app.route('/getActualVsPredictedComparisonTableData')
def getActualVsPredictedComparisonTableData():
    global allTrainedData
    global allActualVsPredictedTable
    global junction

    print("junction", junction)

    allActualVsPredictedTable = dict()
    for algorithm in allTrainedData[junction]:
        actualVsPredictedForTestRatio = dict()
        for testRatio in allTrainedData[junction][algorithm]:
            trained = allTrainedData[junction][algorithm][testRatio]
            actualPred = list()
            for i in range(len(trained.actual)):
                actualPredInstance = {
                    'actual': trained.actual[i],
                    'predicted': trained.predicted[i],
                    'difference': trained.difference[i]
                }
                actualPred.append(actualPredInstance)
            actualVsPredictedForTestRatio[testRatio] = actualPred
        allActualVsPredictedTable[algorithm] = actualVsPredictedForTestRatio
    
    return make_response(allActualVsPredictedTable)


@app.route("/train")
def train():
    global tempdf
    global testRatio
    global junction
    global algorithm
    global trained
    global trainedMap
    global typeOfData
    global trainedAlgorithms
    global plotResponse

    algorithms = ['Linear Regression', 'Random Forest Regression', 'Gradient Boosting Regression', 'Ridge Regression',
                  'Lasso Regression', 'Bayesian Ridge Regression']

    trainedAlgorithms = dict()

    tableResponse = dict()
    for i in algorithms:
        trained = Train(tempdf, i, junction, testRatio)
        trainedAlgorithms[i] = trained

        actualVsPredInstance = list()
        for j in range(len(trained.actual)):
            actualVsPred = {
                'actual': trained.actual[j],
                'predicted': trained.predicted[j],
                'difference': abs(trained.actual[j] - trained.predicted[j])
            }
            actualVsPredInstance.append(actualVsPred)
        tableResponse[i] = actualVsPredInstance

    # dynamically save trained models
    # if junction in trainedMap:
    #     if testRatio in trainedMap[junction]:
    #         print('found testRatio and junction')
    #         trained = trainedMap[junction][testRatio]
    #     else:
    #         print('found junction but not testRatio')
    #         trained = Train(tempdf, algorithm, junction, testRatio)
    #         pickle.dump(trained, open(config.savedTrainedModelsPath, 'wb'))
    #         trainedMap[junction][testRatio] = trained
    #         listAllTrained.append([junction, algorithm, testRatio])
    # else:
    #     print('not found junction, not found testRatio')
    #     trained = Train(tempdf, algorithm, junction, testRatio)
    #     pickle.dump(trained, open(config.savedTrainedModelsPath, 'wb'))
    #     trainedMap[junction] = dict()
    #     trainedMap[junction][testRatio] = trained
    #     listAllTrained.append([junction, algorithm, testRatio])

    return make_response(tableResponse)








@app.route('/getActualPredictedForPlot')
def getActualPredictedForPlot():



    # for i in algorithms:
    #     testRatioComparisons = dict()
    #     trainedData = dict()
    #     for j in possibleTestRatios:
    #         trained = Train(tempdf, i, junction, j)
    #         trainedData[j] = trained
    #         testRatioComparisons[j] = trained.accuracyScore
    #     response[i] = testRatioComparisons
    #     temp[i] = trainedData

    # allTrainedData[junction] = temp

    # allActualVsPredicted = dict()
    # for algorithm in allTrainedData[junction]:
    #     actualVsPredForTestRatio = dict()
    #     for testRatio in allTrainedData[junction][algorithm]:
    #         trained = allTrainedData[junction][algorithm][testRatio]
    #         actualPred = dict()
    #         actualPred['actual'] = trained.actual
    #         actualPred['predicted'] = trained.predicted
    #         actualPred['difference'] = trained.difference
    #         actualPred['labels'] = trained.testAgainst
    #         actualVsPredictedForTestRatio[testRatio] = actualPred
    #     allActualVsPredicted[algorithm] = actualVsPredictedForTestRatio
    
    # return make_response(allActualVsPredicted)




    global trainedAlgorithms
    global allTrainedData

    algorithms = ['Linear Regression', 'Random Forest Regression', 'Gradient Boosting Regression', 'Ridge Regression',
                  'Lasso Regression', 'Bayesian Ridge Regression']
    global junction
    global testRatio
    plotResponse = dict()
    for i in algorithms:
        trained = allTrainedData[junction][i][testRatio]
        actualVsPredPlot = dict()
        actualVsPredPlot['actual'] = trained.actual
        actualVsPredPlot['predicted'] = trained.predicted
        actualVsPredPlot['difference'] = trained.difference
        actualVsPredPlot['labels'] = trained.testAgainst
        plotResponse[i] = actualVsPredPlot
    return make_response(plotResponse)


    # plotResponse = dict()
    # for i in trainedAlgorithms:
    #     trained = trainedAlgorithms[i]
    #     actualVsPredPlot = dict()
    #     actualVsPredPlot['actual'] = trained.actual
    #     actualVsPredPlot['predicted'] = trained.predicted
    #     actualVsPredPlot['difference'] = trained.difference
    #     actualVsPredPlot['labels'] = trained.testAgainst
    #     plotResponse[i] = actualVsPredPlot
    # return make_response(plotResponse)





@app.route('/predictAgainstTime')
def predictAgainstTime():
    global trained
    global time
    global timeFormat
    global junctionDistrictMaps
    global junctionRoadwayWidthMaps
    global roadwayWidthMaxVehiclesMaps
    global numberOfTimesCrossedMaxCapacity
    global junction
    global trainedMap
    global typeOfData
    global trainedAlgorithms
    global algorithm
    trained = trainedAlgorithms[algorithm]

    futurePredictions = trained.predict(time, timeFormat, typeOfData)

    return make_response(futurePredictions)



if __name__ == "__main__":
    global df
    global tempdf
    global time
    global timeFormat
    global testRatio
    global junction
    global algorithm
    global trained
    global autoTrainedModels
    global autoTrainedForJunctions
    global trainedMap
    global accuraciesMap
    global masterAlgorithmAndTestRatioForJunction
    global masterData
    global masterDataTable
    global allTrainedData
    global masterJunctionsAccuracies
    global highestAccuracyAlgorithm
    global highestAccuracyTestRatio
    highestAccuracyAlgorithm = ""
    highestAccuracyTestRatio = float(0)

    allTrainedData = dict()
    trainedMap = dict()
    accuraciesMap = dict()
    df = pd.DataFrame()
    tempdf = pd.DataFrame()
    masterTrainedAlgorithmAndTestRatioForJunction = tuple()
    masterData = dict()
    masterDataTable = dict()
    masterJunctionsAccuracies = dict()

    df = pd.read_csv(config.whereDataset)
    if 'ID' in df.columns:
        df.drop('ID', axis=1, inplace=True)

    autoTrainedForJunctions = list(np.unique(df.Junction))
    tempdf = pd.read_csv(config.whereDataset, parse_dates=True, index_col='DateTime')
    tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
    tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
    tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
    tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()


    if 'ID' in tempdf.columns:
        tempdf.drop('ID', axis=1, inplace=True)

    junctions = np.unique(df.Junction)

    getJunctionRelatedDataFromDB()

    # autoTrainedModels = dict()
    # for i in junctions:
    #     autoTrained = Train(tempdf, 'Random Forest Regression', i, 0.2)
    #     autoTrainedModels[i] = autoTrained
    
    app.run()
