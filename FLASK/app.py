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
from scipy import stats
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_squared_error
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso, BayesianRidge

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

actual = []
predicted = []
testAgainst = []

class Model:
    def __init__(self, name, data, predict_features, test_size, ml_model):
        self.name = name
        self.data = data
        self.predict_features = predict_features
        self.is_trained = False
        self.test_size = test_size
        self.ml_model = ml_model
        self.do_things()

    def cal_rmse(self):
        self.rmse = mean_squared_error(self.ytest, self.ypredict, squared=False)
        global testData
        global predictedData
        global testAgainst
        testData = self.ytest
        predictedData = self.ypredict
        print(self.xtest)
        return self.rmse

    def prequisite(self, test_size):
        self.features = [i for i in self.data.columns if i != self.predict_features]
        self.X = self.data[self.features].values
        self.y = self.data[self.predict_features].values
        print("x", self.X)
        print("y", self.y)
        self.xtrain, self.xtest, self.ytrain, self.ytest = train_test_split(self.X, self.y, test_size=test_size)
        return None

    def fit(self):
        self.is_trained = True
        self.ml_model.fit(self.xtrain, self.ytrain)
        print("self.ml_model", self.ml_model)
        self.ypredict = self.ml_model.predict(self.xtest)
        return self.ml_model

    def cal_r2_score(self):
        self.r2 = r2_score(self.ytest, self.ypredict)
        return self.r2

    def accuracy_score(self):
        self.acc = r2_score(self.ytest, self.ypredict)
        return self.acc

    def do_things(self) -> None:
        self.prequisite(self.test_size)
        self.fit()
        self.cal_rmse()
        self.cal_r2_score()
        return None

    def feature_importances(self, ax) -> None:
        feature_importances = self.ml_model.feature_importances_
        index = lag_models[1].features
        data = pd.DataFrame(pd.Series(feature_importances, index=index).nlargest(10)).reset_index()
        data.columns = ['Features', 'Value']
        g = sns.barplot(data=data, x='Features', y='Value', ax=ax)
        for p in g.patches:
            ax.annotate(
                format(p.get_height(), '.2f'),
                (p.get_x() + p.get_width() / 2, p.get_height() + 0.02),
                ha='center', va='center', weight='bold', fontsize=9
            )
        ax.set_title(f'Plot of {self.name}', fontsize=12)
        ax.grid(True, ls='-.', alpha=0.7)
        ax.set_ylim(0, 1)

    def __repr__(self) -> str:
        if not self.is_trained:
            return f'<{self.name}> (is not trained yet)>'
        return f'<({self.name}: [R² Score: {self.r2}], [RMSE: {self.rmse}])>'



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


def make_time_series_plot3(new_data, junction):
    f, ax = plt.subplots(figsize=(17, 5))
    data=new_data[new_data.Junction == junction]
    ax = sns.lineplot(data=data, y='Vehicles', x='DateTime', ax=ax)
    # ax.set_title(f'Plot show amounts of Vehicles in junction {junction} from {start.Month[0]}-{start.Year[0]} to {end.Month[0]}-{end.Year[0]}', fontsize=15)
    ax.grid(True, ls='-.', alpha=0.75)
    path = config.guiAssets + 'predicted' + str(junction) + '.png'
    plt.savefig(path)
    return path


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
    # print("data2: ", data2)
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
    
    print(dictionary['actual'][:10])
    print(dictionary['predicted'][:10])
    print(dictionary['labels'][:10])

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


    # lag_models = Model(
    #         ml_model=model,
    #         name=f'Dataset of junction {junction} with lag data',
    #         data=lag_data[junction],
    #         predict_features='Vehicles',
    #         test_size=testRatio
    #     )
    
    global accuracyScore
    # accuracyScore = lag_models.r2

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

    # print(end_time)
    # new_data = lag_data[junction].copy() # create a copy of dataset with that junction
    # initialNumberOfRows = new_data.shape[0]
    # features = lag_models.features # get features of each models in that junction
    # time_period = []
    # while cur_time != end_time:
    #     time_period.append(cur_time)
    #     last = new_data.tail(1).copy() # get the last row of dataset, just make a copy!
    #     new_data = pd.concat([new_data, last]) # concatenate the copy dataset with it's last row
    #     for i in range(1, 3): # create lag data
    #         new_data[f'Vehicles_lag_{i}'] = new_data.Vehicles.shift(i) # shift by periods i
    #     new_data.iloc[len(new_data) - 1, [1, 2, 3]] = [cur_time.month, cur_time.day, cur_time.hour] # assign value for those columns
    #     last = new_data[features].tail(1).values # create a new last data that drop all nan
    #     new_data.iloc[len(new_data) - 1, 0] = round(lag_models.ml_model.predict(last)[0]) # predicting for vehicles
    #     cur_time += timedelta(minutes=60) # add to a cur_time 1 hour
    # new_data = new_data[initialNumberOfRows:]
    # new_data.index = time_period
    # new_data['DateTime'] = new_data.index
    # junctionarr = []
    # for i in range(new_data.shape[0]):
    #     junctionarr.append(junction)
    # series = pd.Series(junctionarr)
    # new_data['Junction'] = junctionarr

    # year = []
    # for i in range(new_data.shape[0]):
    #     year.append(2017)
    # series2 = pd.Series(year)
    # new_data['Year'] = year
    # new_data = new_data.set_index('DateTime')
    # data = new_data[new_data['Junction'] == junction]
    # data['DateTime'] = data.index
    # data = data.drop(['Vehicles_lag_1', 'Vehicles_lag_2'], axis='columns')
    # data = data.reset_index(drop=True)
    # global dfResult
    # dfResult = data
    # vehicles = list(data['Vehicles'])
    # datetime = []
    # for i in data['DateTime']:
    #     datetime.append(str(i))
    return make_response(result)


if __name__ == "__main__":
    app.run()
