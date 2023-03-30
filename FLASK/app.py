import sys
import Train
import requests
from flask import Flask, make_response, request
from flask_cors import CORS
import json
import config
import numpy as np
import pandas as pd
import scipy
from statsmodels.stats.stattools import jarque_bera, durbin_watson
import statsmodels.api as sm
from scipy.stats import skew, kurtosis
from datetime import timedelta
from statistics import *

app = Flask(__name__)
cors = CORS(app)


@app.route('/checkIfTrained')
def checkIfTrained():
    global allTrainedData
    args = request.args
    args = args.to_dict()

    junction = args['junction']
    if "%20" in args['junction']:
        junction = args['junction'].replace("%20", " ")

    if junction in allTrainedData:
        return make_response([True])
    else:
        return make_response([False])



@app.route("/getCsvData")
def getCsvData():

    # get/declare global variables
    global springUrl
    global df
    global tempdf
    global uniqueJunctionsInDataset
    global typeOfData

    # sets 'False' if getting csv data from spring backend is unsuccessful
    success: bool = True
    url: str = springUrl + '/process/exchangeCsvData'
    try:
        uResponse: any = requests.get(url)
    except:
        success = False
        return {getCsvData: "Connection Error"}
    
    JResponse: str = uResponse.text
    csvData: list = json.loads(JResponse)


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
        typeOfData = 'Hours'
    elif timeDifference == 1:
        typeOfData = 'Days'
    elif timeDifference == 30:
        typeOfData = 'Months'

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
    return make_response(response)



def f_test(x: list, y: list):
    x = np.array(x)
    y = np.array(y)
    f = np.var(x, ddof=1)/np.var(y, ddof=1) #calculate F test statistic 
    dfn = x.size-1 #define degrees of freedom numerator 
    dfd = y.size-1 #define degrees of freedom denominator 
    p = 1- scipy.stats.f.cdf(f, dfn, dfd) #find p-value of F test statistic 
    return f, p


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
                { 'Property': 'Testing Ratio', 'Value': trained.testSize },
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


@app.route('/listenTime')
def listenTime():
    global springUrl
    success = True
    url = springUrl + '/process/exchangeTime'

    try:
        uResponse: any = requests.get(url)
    except:
        success = False
        return "Connection Error"
    JResponse: str = uResponse.text
    response: list = json.loads(JResponse)

    global time
    global timeFormat
    global showBy

    time = response['timePeriod']
    timeFormat = response['timeFormat']
    if "showBy" in response:
        showBy = response['showBy']
    dictionary = dict()
    if success:
        dictionary['gotTime'] = "success"
        return make_response(dictionary)
    else:
        dictionary['gotTime'] = "fail"
        return make_response(dictionary)


def getJunctionRelatedDataFromDB():
    global springUrl
    global junctionDistrictMaps
    global junctionRoadwayWidthMaps
    global roadwayWidthMaxVehiclesMaps
    
    junctionDistrictMaps = list()
    junctionRoadwayWidthMaps = list()
    roadwayWidthMaxVehiclesMaps = list()

    url: str = springUrl + '/junctionSpecifics/junctionDistrict/getAllJunctionDistrictMaps'
    try:
        uResponse: any = requests.get(url)
    except:
        return "Connection Error"
    JResponse: str = uResponse.text
    junctionDistrictMaps = json.loads(JResponse)

    url = springUrl + '/junctionSpecifics/junctionRoadwayWidth/getAllJunctionRoadwayWidthMaps'
    try:
        uResponse: any = requests.get(url)
    except:
        return "Connection Error"
    JResponse: str = uResponse.text
    junctionRoadwayWidthMaps = json.loads(JResponse)

    url: str = springUrl + '/junctionSpecifics/roadwayWidthMaxVehicles/getAllRoadwayWidthMaxVehiclesMaps'
    try:
        uResponse: any = requests.get(url)
    except:
        return "Connection Error"
    JResponse: str = uResponse.text
    roadwayWidthMaxVehiclesMaps = json.loads(JResponse)



@app.route('/listenToTrainingInputs')
def listenTrainingInputs():
    global springUrl
    success = True
    url = springUrl + '/process/exchangeTrainingInputs'

    try:
        uResponse = requests.get(url)
    except:
        success = False
        return "Connection Error"
    JResponse: str = uResponse.text
    response: list = json.loads(JResponse)
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
    global showBy

    highestAccuracyAlgorithm = ""
    highestAccuracyTestRatio = float(0)
    highestAccuracyTrained = allTrainedData[junction][algorithm][testRatio]
    plotResponse = highestAccuracyTrained.predict(time, timeFormat, showBy)
    return make_response(plotResponse)
    


@app.route("/addToMaster")
def addToMaster():
    args = request.args
    args = args.to_dict()

    algorithm = args['algorithm']
    if "%20" in algorithm:
        algorithm = algorithm.replace("%20", " ")

    testRatio = float(args['testRatio'])
    relativeChange = float(args['relativeChange'])

    global masterAlgorithmAndTestRatioForJunction
    global allTrainedData
    global masterData
    global relativeChangeMap

    junction = args['junction']
    if "%20" in args['junction']:
        junction = args['junction'].replace("%20", " ")
    masterTrainedAlgorithmAndTestRatioForJunction = (algorithm, testRatio)

    findTrained = allTrainedData[junction][algorithm][testRatio]
    masterData[junction] = findTrained
    relativeChangeMap[junction] = relativeChange
    return make_response(args)


@app.route('/getRelativeChange')
def getRelativeChange():
    global relativeChangeMap
    global masterData
    global junction

    args = request.args
    args = args.to_dict()

    factor = args['factor']
    if "%20" in factor:
        factor = factor.replace("%20", " ")

    trained = masterData[junction]
    array = trained.getRelativeChange(relativeChangeMap[junction], factor)

    return make_response(array)


@app.route('/getAllRelativeChange')
def getAllRelativeChangePercentage():
    global relativeChangeMap
    return make_response(relativeChangeMap)


@app.route("/getMasterTrainedDataPlot")
def getMasterTrainedDataPlot():
    global allTrainedData
    global masterData
    global time
    global timeFormat
    global masterDataTable
    global masterJunctionsAccuracies
    global showBy
    
    masterDataTable = dict()
    response = dict()
    masterJunctionsAccuracies = dict()
    for i in masterData:
        trained = masterData[i]
        response[i] = trained.predict(time, timeFormat, showBy)
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

    args = request.args
    args = args.to_dict()

    junction = args['junction']
    if "%20" in junction:
        junction = junction .replace("%20", " ")

    action = args['action']

    possibleTestRatios = np.arange(0.1, 1, 0.1)

    algorithms = ['Linear Regression', 'Random Forest Regression', 'Gradient Boosting Regression', 'Ridge Regression',
                  'Lasso Regression', 'Bayesian Ridge Regression']
    response = dict()
    temp = dict()

    if action == 'clear':
        print('clear')
        for i in algorithms:
            testRatioComparisons = dict()
            trainedData = dict()
            for j in possibleTestRatios:
                trained = Train.Train(tempdf, i, junction, j)
                trainedData[j] = trained
                testRatioComparisons[j] = trained.accuracyScore
            response[i] = testRatioComparisons
            temp[i] = trainedData
    if action == 'append':
        print('append')
        newData = tempdf.copy()
        for i in algorithms:
            testRatioComparisons = dict()
            trainedData = dict()
            for j in possibleTestRatios:
                # trained = Train.Train(tempdf, i, junction, j)
                trained = allTrainedData[junction][i][j]
                trained.appendAndStartTraining(newData)
                trainedData[j] = trained
                testRatioComparisons[j] = trained.accuracyScore
            response[i] = testRatioComparisons
            temp[i] = trainedData


    allTrainedData[junction] = temp
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



@app.route('/getAllJunctionsFuturePredictionsTable')
def getAllJunctionsFuturePredictions():
    global allJunctionsTableData
    return make_response(allJunctionsTableData)


@app.route('/getActualVsPredictedComparison')
def getActualVsPredictedComparison():
    global allTrainedData
    global allActualVsPredicted
    global junction

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
    global springUrl
    global showBy
    global relativeChangeMap
    global allJunctionsCsvData

    showBy: str = ""
    highestAccuracyAlgorithm = ""
    highestAccuracyTestRatio = float(0)

    springUrl = ""
    allTrainedData = dict()
    trainedMap = dict()
    accuraciesMap = dict()
    df = pd.DataFrame()
    tempdf = pd.DataFrame()
    masterTrainedAlgorithmAndTestRatioForJunction = tuple()
    masterData = dict()
    masterDataTable = dict()
    masterJunctionsAccuracies = dict()
    relativeChangeMap = dict()
    allJunctionsCsvData = dict()


    if (len(sys.argv) == 1 or sys.argv[1] == 'DEV'):
        springUrl = config.spring_dev_url
        getJunctionRelatedDataFromDB()
        app.run()
    elif (sys.argv[1] == 'PROD'):
        springUrl = config.spring_prod_url
        getJunctionRelatedDataFromDB()
        app.run(debug=True, host='0.0.0.0')
    else:
        raise Exception('Argument not identified')
