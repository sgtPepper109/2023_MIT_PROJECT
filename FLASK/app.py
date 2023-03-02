import requests
from flask import Flask, make_response, jsonify
from flask_cors import CORS
import logging

import simplejson
import json
import config

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.dates import DateFormatter
from datetime import datetime, timedelta, date
import scipy
from scipy import stats
from scipy.stats import skew, kurtosis
from sklearn.preprocessing import StandardScaler
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

    df = pd.DataFrame.from_dict(csvData)
    df = df._convert(numeric=True)
    tempdf = df.copy()

    tempdf['DateTime'] = pd.to_datetime(tempdf['DateTime'])
    tempdf = tempdf.set_index('DateTime')

    tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
    # extract month from date
    tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
    # extract day from date
    tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
    # extract hour from date
    tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()
    tempdf.drop('ID', axis=1, inplace=True)

    dictionary = dict()
    if success:
        dictionary['getCsvData'] = "success"
        return make_response(dictionary)
    else:
        dictionary['getCsvData'] = "fail"
        return make_response(dictionary)



@app.route('/getAllJunctions')
def getAllJunctions():
    global df
    junctions = list()
    for i in list(np.unique(df.Junction)):
        junctions.append(i)
    return make_response(junctions)


@app.route("/setData")
def setData():
    success = True
    url = config.springUrl + '/operation/findLast'

    try:
        uResponse = requests.get(url)
    except:
        return "Connection Error"
    JResponse = uResponse.text
    operationData = json.loads(JResponse)
    
    global dataset
    global trainRatio
    global testRatio
    global testRatio2
    global valRatio
    dataset = operationData["dataset"]
    trainRatio = float(operationData['trainRatio'])
    testRatio = float(operationData['testRatio'])

    testRatio2 =  testRatio
    global gotInput
    gotInput.append(testRatio)

    dictionary = dict()
    if success:
        dictionary['setData'] = "success"
        return make_response(dictionary)
    else:
        dictionary['setData'] = "fail"
        return make_response(dictionary)


@app.route("/getTableData")
def getTableData():
    
    arr = []

    df2 = df.copy()
    year = np.array(tempdf['Year'])
    month = np.array(tempdf['Month'])
    day = np.array(tempdf['Day'])
    hour = np.array(tempdf['Hour'])

    df2['Year'] = year
    df2['Month'] = month
    df2['Day'] = day
    df2['Hour'] = hour

    head = df2
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


def get_list_data(dataf, drop=[]):
    for i in drop:
        try:
            dataf.drop(drop, axis=1, inplace=True)
        except:
            print(f"{i} not present")


    dataf = [dataf[dataf.Junction == i].drop('Junction', axis=1) for i in range(5)]
    return dataf



@app.route('/getResultTable')
def getResultTable():

    global allJunctionsDfResult
    global df
    global autoPrediction
    global junction

    print("autoPrediction", autoPrediction)
    print("junction", junction)
    
    junctions = np.unique(df.Junction)
    if autoPrediction == False:
        junctions = [junction]


    response = list()
    k = 0
    for i in junctions:
        arr = []
        head = allJunctionsDfResult[k]
        k += 1

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
        response.append(arr)
    return make_response(response)


@app.route('/getAccuracy')
def getAccuracy():
    global accuracyScore
    dictionary = dict()
    dictionary['accuracy'] = accuracyScore
    return make_response(dictionary)


@app.route('/getActualPredicted')
def getActualPredicted():
    global actual
    global predicted
    predictedDf = pd.DataFrame()
    predictedDf['actual'] = actual
    predictedDf['predictedData'] = predicted
    predictedDf = predictedDf.reset_index(drop=True)
    arr = []
    data2 = predictedDf.to_dict()
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


@app.route('/getActualPredictedForPlot')
def getActualPredictedForPlot():
    global actual
    global predicted
    global testAgainst
    arr = []
    labels = []
    for i in range(1, len(actual) + 1):
        labels.append(i)
    dictionary = dict()
    dictionary['actual'] = actual.tolist()
    dictionary['predicted'] = predicted.tolist()
    dictionary['labels'] = testAgainst
    arr.append(dictionary)
    
    return make_response(arr)


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
    global time
    global timeFormat
    global inputTestRatio
    global algorithm

    junction = response['junction']
    inputTestRatio = response['testRatio']
    time = response['time']
    timeFormat = response['timeFormat']
    algorithm = response['algorithm']
    dictionary = dict()
    if success:
        dictionary['gotTrainingSpecifics'] = "success"
        return make_response(dictionary)
    else:
        dictionary['gotTrainingSpecifics'] = "fail"
        return make_response(dictionary)




@app.route('/input')
def getInput():
    success = True
    url = config.springUrl + '/process/exchangeInput'

    try:
        uResponse = requests.get(url)
    except:
        success = False
        return "Connection Error"
    JResponse = uResponse.text
    mainInput = json.loads(JResponse)

    global junction
    global time
    global timeFormat
    global algorithm

    junction = mainInput['junction']
    time = mainInput['time']
    timeFormat = mainInput['timeFormat']
    algorithm = mainInput['algorithm']

    global gotInput
    gotInput = list()
    gotInput.append(junction)
    gotInput.append(time)
    gotInput.append(timeFormat)
    gotInput.append(algorithm)
    
    dictionary = dict()
    if success:
        dictionary['gotJunctionTime'] = "success"
        return make_response(dictionary)
    else:
        dictionary['gotJunctionTime'] = "fail"
        return make_response(dictionary)




def f_test(x, y):
    x = np.array(x)
    y = np.array(y)
    f = np.var(x, ddof=1)/np.var(y, ddof=1) #calculate F test statistic 
    dfn = x.size-1 #define degrees of freedom numerator 
    dfd = y.size-1 #define degrees of freedom denominator 
    p = 1- scipy.stats.f.cdf(f, dfn, dfd) #find p-value of F test statistic 
    return f, p



@app.route('/getModelSummary')
def getModelSummary():
    global modelSummary2
    return make_response(modelSummary2)



@app.route('/getAccuracies')
def getAccuracies():
    global accuracies
    return make_response(accuracies)


@app.route('/predict')
def predict():
    global autoPrediction
    global df
    global tempdf
    global junction
    global time
    global timeFormat
    global testRatio
    global dfResult
    global inputTestRatio
    global testRatio2

    if inputTestRatio != 1:
        testRatio2 = inputTestRatio
        testRatio = inputTestRatio

    autoPrediction = False
    allJunctionsPlotData = list()
    global allJunctionsDfResult
    allJunctionsDfResult = list()
    print(junction, testRatio, time, timeFormat, algorithm)
    predict2()
    allJunctionsDfResult.append(dfResult)
    allJunctionsPlotData.append(plotData)
    return make_response(allJunctionsPlotData)
    


def predict2():
    with app.app_context():
        global df
        global tempdf
        global testRatio
        global junction
        global time
        global timeFormat
        global algorithm
        
        global testRatio2
        testRatio = testRatio2
        inputTestRatio = 1

        global gotInput
        if gotInput != []:
            junction = gotInput[0]
            junction = junction
            time = gotInput[1]
            time = int(time)
            timeFormat = gotInput[2]
            algorithm = gotInput[3]

        print(junction, time, timeFormat, algorithm, testRatio)
        
        if algorithm == "Random Forest Regression":
            model = RandomForestRegressor()
        elif algorithm == "Gradient Boosting Regression":
            model = GradientBoostingRegressor()
        elif algorithm == "Linear Regression":
            model = LinearRegression()
        elif algorithm == "Logistic Regression":
            model = LogisticRegression()
        elif algorithm == "Ridge Regression":
            model = Ridge(alpha=1.0)
        elif algorithm == "Lasso Regression":
            model = Lasso(alpha=0.1)
        elif algorithm == "Bayesian Ridge Regression":
            model = BayesianRidge()


        global accuracies
        model1 = RandomForestRegressor()
        model2 = GradientBoostingRegressor()
        model3 = LinearRegression()
        model5 = Ridge(alpha=1.0)
        model6 = Lasso(alpha=0.1)
        model7 = BayesianRidge()

        global accuracyScore

        mainData = tempdf.copy()
        mainData = mainData[mainData.Junction == junction]
        curr_time = mainData.tail(1).index[0] # get the current time, the last time of that dataset
        

        if timeFormat == "Days":
            end_time = curr_time + pd.DateOffset(days=time) # the end time after 4 time that we want to predict
        elif timeFormat == "Months":
            end_time = curr_time + pd.DateOffset(months=time) # the end time after 4 time that we want to predict
        else:
            end_time = curr_time + pd.DateOffset(years=time) # the end time after 4 time that we want to predict

        mainData = mainData.drop(['Junction'], axis='columns')

        x = mainData.drop(['Vehicles'], axis='columns')
        y = mainData.Vehicles

        xtrain, xtest, ytrain, ytest = train_test_split(x, y, test_size = testRatio)

        model.fit(xtrain, ytrain)
        model1.fit(xtrain, ytrain)
        model2.fit(xtrain, ytrain)
        model3.fit(xtrain, ytrain)
        model5.fit(xtrain, ytrain)
        model6.fit(xtrain, ytrain)
        model7.fit(xtrain, ytrain)


        timePeriod = list()
        while curr_time != end_time:
            timePeriod.append(curr_time)
            curr_time += timedelta(minutes=60)

        toPredict = pd.DataFrame()
        years = list()
        months = list()
        days = list()
        hours = list()
        dateTime = list()
        
        for i in timePeriod:
            dateTime.append(i)
            years.append(i.year)
            months.append(i.month)
            days.append(i.day)
            hours.append(i.hour)

        toPredict['Year'] = years
        toPredict['Month'] = months
        toPredict['Day'] = days
        toPredict['Hour'] = hours
        toPredict['DateTime'] = dateTime
        toPredict.index = toPredict['DateTime']
        toPredict = toPredict.drop(['DateTime'], axis='columns')

        futureDatesPredicted = model.predict(toPredict)


        global dfResult
        dfResult = toPredict.copy()

        columnDateTime = list()
        for i in dateTime:
            columnDateTime.append(str(i))

        dfResult['DateTime'] = columnDateTime
        dfResult = dfResult.reset_index(drop=True)
        dfResult['Vehicles'] = list(futureDatesPredicted)

        xtestIndex = list(xtest.index)
        xtestIndex.sort()
        newXtest = pd.DataFrame()
        
        years = list()
        months = list()
        days = list()
        hours = list()
        dateTime = list()
        
        for i in xtestIndex:
            dateTime.append(i)
            years.append(i.year)
            months.append(i.month)
            days.append(i.day)
            hours.append(i.hour)

        newXtest['Year'] = years
        newXtest['Month'] = months
        newXtest['Day'] = days
        newXtest['Hour'] = hours
        newXtest['DateTime'] = dateTime
        newXtest.index = newXtest['DateTime']
        newXtest = newXtest.drop(['DateTime'], axis='columns')

        newYtest = list()
        for i in newXtest.index:
            newYtest.append(ytest[i])        

        newYtest = pd.Series(newYtest)
        newYtest.index = newXtest.index

        global actual
        global predicted
        actual = newYtest
        predicted = model.predict(newXtest)
        accuracyScore = model.score(newXtest, newYtest)


        accuracyScore1 = model1.score(newXtest, newYtest)
        accuracyScore2 = model2.score(newXtest, newYtest)
        accuracyScore3 = model3.score(newXtest, newYtest)
        accuracyScore5 = model5.score(newXtest, newYtest)
        accuracyScore6 = model6.score(newXtest, newYtest)
        accuracyScore7 = model7.score(newXtest, newYtest)


        accuracies = []
        tempaccuracy = dict()
        tempaccuracy['model'] = 'Random Forest Regression'
        tempaccuracy['accuracyscore'] = accuracyScore1
        accuracies.append(tempaccuracy)
        tempaccuracy = dict()
        tempaccuracy['model'] = 'Gradient Boosting Regression'
        tempaccuracy['accuracyscore'] = accuracyScore2
        accuracies.append(tempaccuracy)
        tempaccuracy = dict()
        tempaccuracy['model'] = 'Linear Regression'
        tempaccuracy['accuracyscore'] = accuracyScore3
        accuracies.append(tempaccuracy)
        tempaccuracy = dict()
        tempaccuracy['model'] = 'Ridge Regression'
        tempaccuracy['accuracyscore'] = accuracyScore5
        accuracies.append(tempaccuracy)
        tempaccuracy = dict()
        tempaccuracy['model'] = 'Lasso Regression'
        tempaccuracy['accuracyscore'] = accuracyScore6
        accuracies.append(tempaccuracy)
        tempaccuracy = dict()
        tempaccuracy['model'] = 'Bayesian Ridge Regression'
        tempaccuracy['accuracyscore'] = accuracyScore7
        accuracies.append(tempaccuracy)



        global testAgainst
        testAgainst = []
        testAgainst2 = newXtest.index.copy()
        for i in testAgainst2:
            testAgainst.append(str(i))

        dictionary = dict()
        dictionary['vehicles'] = list(futureDatesPredicted)

        toPredictDateTime = list()
        for i in toPredict.index:
            toPredictDateTime.append(str(i))
        dictionary['datetime'] = toPredictDateTime
        
        result = [dictionary]
        newXtrain = xtrain
        newYtrain = ytrain
        newXtrain = sm.add_constant(newXtrain)
        model8 = sm.OLS(newYtrain, newXtrain).fit()

        global modelSummary
        modelSummary = model8.summary()
        modelSummary = str(modelSummary)
        
        modelSummary = modelSummary.split('\n')
        

        anotherSummary = dict()
        anotherSummary['Dep. Variable: '] = 'Vehicles'
        anotherSummary['Model: '] = str(model)
        anotherSummary['Accuracy: '] = accuracyScore
        anotherSummary['R-squared: '] = r2_score(newYtest, predicted)
        anotherSummary['Date & Time: '] = datetime.now()
        anotherSummary['No. Observations: '] = df.shape[0]

        fstatistic = f_test(newYtest, predicted)
        anotherSummary['F-Statistic: '] = fstatistic[0]
        anotherSummary['(prob) F-Statistic: '] = fstatistic[1]
        anotherSummary['Explained Variance: '] = metrics.explained_variance_score(newYtest, predicted)
        anotherSummary['Mean Absolute Error: '] = metrics.mean_absolute_error(newYtest, predicted)
        anotherSummary['Mean Squared Error: '] = metrics.mean_squared_error(newYtest, predicted)
        anotherSummary['Mean Squared Log Error: '] = metrics.mean_squared_log_error(newYtest, predicted)
        anotherSummary['Median Absolute Error: '] = metrics.median_absolute_error(newYtest, predicted)
        anotherSummary['Skew: '] = skew(list(df.Vehicles), axis=0, bias=True)
        anotherSummary['Kurtosis: '] = kurtosis(list(df.Vehicles), axis=0, bias=True)
        anotherSummary['Jarque-Bera (JB): '] = str(jarque_bera(np.array(df.Vehicles)))
        anotherSummary['Durbin Watson: '] = durbin_watson(np.array(df.Vehicles))



        global modelSummary2
        if algorithm == 'Linear Regression':
            modelSummary2 = modelSummary
        else:
            listStrings = list()
            for i in anotherSummary:
                s = ""
                s += i
                s += ": "
                s += str(anotherSummary[i])
                listStrings.append(s)
            modelSummary2 = listStrings

        global plotData
        plotData = result
        
        

        return make_response(result)







@app.route('/getAllJunctionsAccuracies')
def getAllJunctionsAccuracies():
    global allJunctionsAccuracies
    return make_response(allJunctionsAccuracies)
    

@app.route('/getAllJunctionsAccuracyScore')
def getAllJunctionsAccuracyScore():
    global allJunctionsAccuracyScore
    return make_response(allJunctionsAccuracyScore)


@app.route('/getAllJunctionsPredictedTableData')
def getAllJunctionsPredictedTableData():
    global allJunctionsPredictedTableData
    return make_response(allJunctionsPredictedTableData)

@app.route('/getAllJunctionsPlotData')
def getAllJunctionsPlotData():
    global allJunctionsPlotData
    return make_response(allJunctionsPlotData)



if __name__ == "__main__":

    global df
    global tempdf
    global time
    global timeFormat
    global testRatio
    global inputTestRatio
    global testRatio2
    global junction
    global algorithm
    global accuracies
    global accuracyScore
    global dfResult
    global actual
    global predicted
    global testAgainst
    global modelSummary
    global modelSummary2
    global plotData
    global allJunctionsDfResult
    global autoPrediction
    allJunctionsDfResult = list()
    global gotInput
    gotInput = list()
    autoPrediction = True

    testRatio2 = 0.1
    global junctions

    df = pd.DataFrame()
    tempdf = pd.DataFrame()
    df = pd.read_csv(config.whereDataset)
    tempdf = pd.read_csv(config.whereDataset, parse_dates=True, index_col='DateTime')
    tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
    tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
    tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
    tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()
    tempdf.drop('ID', axis=1, inplace=True)

    junctions = np.unique(df.Junction)

    global allJunctionsAccuracies
    global allJunctionsAccuracyScore
    global allJunctionsPredictedTableData
    global allJunctionsPlotData

    allJunctionsAccuracies = dict()
    allJunctionsAccuracyScore = dict()
    allJunctionsPredictedTableData = dict()
    allJunctionsPlotData = dict()

    print('jn',junctions)    
    for i in junctions:
        junction = i
        time = 2
        timeFormat = 'Days'
        testRatio = 0.1
        algorithm = 'Random Forest Regression'
        predict2()
        allJunctionsAccuracies[i] = accuracies
        allJunctionsAccuracyScore[i] = accuracyScore
        allJunctionsPlotData[i] = plotData


        arr = []
        head = dfResult

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

        allJunctionsPredictedTableData[i] = arr
    
    app.run()
