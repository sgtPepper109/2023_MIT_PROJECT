import requests
from flask import Flask, make_response, jsonify
from flask_cors import CORS
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


guiAssetsFolder = config.guiAssets
for file in os.listdir(guiAssetsFolder):
    os.remove(os.path.join(guiAssetsFolder, file))


trainRatio = 0
testRatio = 0
valRatio = 0
dataset = ""
junction = 0
time = 0
timeFormat = ""
algorithm = ""
df = pd.DataFrame()
tempdf = pd.DataFrame()
dfResult = pd.DataFrame()
accuracyScore = np.float64()
modelSummary = []
modelSummary2 = dict()

actual = []
predicted = []
testAgainst = []


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
    global valRatio
    dataset = operationData["dataset"]
    trainRatio = float(operationData['trainRatio'])
    testRatio = float(operationData['testRatio'])
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
    return dictionary



@app.route("/plot")
def plot():
    global df
    global tempdf

    response = []
    for i in range(1, 5):
        response.append(createDict(i))
    return make_response(response)


def get_list_data(dataf, drop=[]):
    for i in drop:
        try:
            dataf.drop(drop, axis=1, inplace=True)
        except:
            print(f"{i} not present")


    # create a list of dataframe has the data in that junction and remove the junction identify
    dataf = [dataf[dataf.Junction == i].drop('Junction', axis=1) for i in range(5)]
    return dataf



@app.route('/getResultTable')
def getResultTable():
    arr = []
    global dfResult
    head = dfResult

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



@app.route('/predict')
def predict():
    global df
    global tempdf
    global junction
    global time
    global timeFormat
    global testRatio

    junction = int(junction)
    time = int(time)
    

    # Create Lag Data
    lag_df = tempdf.copy()
    for i in range(1, 3):
        lag_df[f'Vehicles_lag_{i}'] = tempdf.Vehicles.shift(i)


    # drop all null rows
    lag_df.dropna(inplace=True)


    lag_data = get_list_data(lag_df, drop=['Year'])

    global algorithm

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


    
    global accuracyScore

    mainData = lag_data[junction]
    curr_time = mainData.tail(1).index[0] # get the current time, the last time of that dataset
    
    if timeFormat == "Days":
        end_time = curr_time + pd.DateOffset(days=time) # the end time after 4 time that we want to predict
    elif timeFormat == "Months":
        end_time = curr_time + pd.DateOffset(months=time) # the end time after 4 time that we want to predict
    else:
        end_time = curr_time + pd.DateOffset(years=time) # the end time after 4 time that we want to predict




    mainData = tempdf.copy()
    mainData = mainData[mainData.Junction == junction]
    mainData = mainData.drop(['Junction'], axis='columns')

    x = mainData.drop(['Vehicles'], axis='columns')
    y = mainData.Vehicles
    xtrain, xtest, ytrain, ytest = train_test_split(x, y, test_size = testRatio)
    model.fit(xtrain, ytrain)


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

    global testAgainst
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
    model2 = sm.OLS(newYtrain, newXtrain).fit()

    global modelSummary
    modelSummary = model2.summary()
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

    return make_response(result)


if __name__ == "__main__":
    app.run()
