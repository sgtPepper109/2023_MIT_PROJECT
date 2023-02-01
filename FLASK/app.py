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

app = Flask(__name__)
cors = CORS(app)


guiAssetsFolder = config.guiAssets
for file in os.listdir(guiAssetsFolder):
    os.remove(os.path.join(guiAssetsFolder, file))


trainRatio = 0
testRatio = 0
valRatio = 0
dataset = ""
df = pd.DataFrame()
tempdf = pd.DataFrame()
dfResult = pd.DataFrame()
accuracyScore = np.float64()

testData = []
predictedData = []

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
        print("ytest")
        print(self.ytest)
        print("ypredict")
        print(self.ypredict)
        global testData
        global predictedData
        testData = self.ytest
        predictedData = self.ypredict
        return self.rmse

    def prequisite(self, test_size):
        self.features = [i for i in self.data.columns if i != self.predict_features]
        self.X = self.data[self.features].values
        self.y = self.data[self.predict_features].values
        self.Xtrain, self.Xtest, self.ytrain, self.ytest = train_test_split(self.X, self.y, test_size=test_size)
        return None

    def fit(self):
        self.is_trained = True
        self.ml_model.fit(self.Xtrain, self.ytrain)
        self.ypredict = self.ml_model.predict(self.Xtest)
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
        print('here')
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

    # print(df.head())
    # print(tempdf.head())

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
    # print(operationData)
    
    global dataset
    global trainRatio
    global testRatio
    global valRatio
    # print(operationData)
    dataset = operationData["dataset"]
    trainRatio = float(operationData['trainratio'])
    testRatio = float(operationData['testratio'])
    valRatio = float(operationData['valratio'])
    # print(type(operationData['testratio']), type(trainRatio), type(valRatio))
    # print(trainRatio, testRatio, valRatio)
    
    # print("df: ", df)
    # print("tempdf: ", tempdf)
    dictionary = dict()
    if success:
        dictionary['setData'] = "success"
        return make_response(dictionary)
    else:
        dictionary['setData'] = "fail"
        return make_response(dictionary)


@app.route("/getTableData")
def getTableData():
    
    # print(df)
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

    # print("df2")
    # print(df2)

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


# def histogram(dataframe, junction):
#     temp = dataframe[dataframe['Junction'] == junction]
#     f, ax = plt.subplots(figsize=(17, 5))
#     ax = sns.histplot(temp['Vehicles'], kde=True, stat='probability')
#     ax.set_title(f'Plot show the distribution of data in junction {junction}')
#     ax.grid(True, ls='-.', alpha=0.75)
#     path = 'C:/Users/Acer/2023MitProject/GUI/src/assets/histogram' + str(junction) + '.png'
#     plt.savefig(path)
#     return path


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
    # print('df in plot: \n', df)
    
    # savedFigFor1 = histogram(df, 1)
    # savedFigFor2 = histogram(df, 2)
    # savedFigFor3 = histogram(df, 3)
    # savedFigFor4 = histogram(df, 4)

    response = []
    for i in range(1, 5):
        response.append(createDict(i))
    return make_response(response)


def get_list_data(dataf, drop=[]):
    for i in drop:
        try:
            dataf.drop(drop, axis=1, inplace=True)
        except:
            print(f"{i} doesn't has in data")
    # create a list of dataframe has the data in that junction and remove the junction identify
    dataf = [dataf[dataf.Junction == i].drop('Junction', axis=1) for i in range(5)]
    return dataf


def make_time_series_plot3(new_data, junction):
    f, ax = plt.subplots(figsize=(17, 5))
    data=new_data[new_data.Junction == junction]
    ax = sns.lineplot(data=data, y='Vehicles', x='DateTime', ax=ax)
    start = data.head(1)
    end = data.tail(1)
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

    datetime = []
    for i in head['DateTime']:
        datetime.append(str(i))
    
    datetime = pd.Series(datetime)
    head['DateTime'] = datetime

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
    # print(arr)
    return make_response(arr)


@app.route('/getAccuracy')
def getAccuracy():
    global accuracyScore
    dictionary = dict()
    dictionary['accuracy'] = accuracyScore
    return make_response(dictionary)


@app.route('/getActualPredicted')
def getActualPredicted():
    global testData
    global predictedData
    predictedDf = pd.DataFrame()
    predictedDf['actual'] = testData
    predictedDf['predictedData'] = predictedData
    print("predictedDf")
    print(predictedDf)
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
    print("getActualPredicted arr")
    # print(arr)
    return make_response(arr)


@app.route('/getActualPredictedForPlot')
def getActualPredictedForPlot():
    global testData
    global predictedData
    arr = []
    labels = []
    for i in range(1, len(testData) + 1):
        labels.append(i)
    # print(type(labels))
    # print(labels)
    print('here')
    dictionary = dict()
    dictionary['actual'] = testData.tolist()
    dictionary['predicted'] = predictedData.tolist()
    dictionary['labels'] = labels
    arr.append(dictionary)
    print(len(testData), len(predictedData), len(labels))
    return make_response(arr)


@app.route('/predict/<junction>/<months>')
def predict(junction=None, months=None):
    global df
    global tempdf
    junction = int(junction)
    days = int(months)
    months = float(days/30)
    # months = days
    # print('\n', junction, '\n')
    standardization = lambda x: StandardScaler().fit_transform(x)
    # z_df = tempdf.copy()
    # z_df['Vehicles'] = standardization(z_df.Vehicles.values.reshape(-1, 1))
    # z_df.head()
    # data = get_list_data(tempdf)
    # z_data = get_list_data(z_df)

    # models = [None]
    # for i in range(1, 5):
    #     models += [
    #         Model(
    #             ml_model=RandomForestRegressor(),
    #             name=f'Dataset of junction {i}',
    #             data=data[i],
    #             predict_features='Vehicles',
    #             test_size=1/4
    #         )
    #     ]
    
    # z_models = [None]
    # for i in range(1, 5):
    #     z_models += [
    #         Model(
    #             ml_model=RandomForestRegressor(),
    #             name=f'Dataset of junction {i}',
    #             data=z_data[i],
    #             predict_features='Vehicles',
    #             test_size=1/4
    #         )
    #     ]
    
    global testRatio
    # print("testRatio: ", testRatio)
    lag_df = tempdf.copy()
    # print("tempdf")
    # print(tempdf.head())
    # print("lag_df")
    # print(lag_df)
    for i in range(1, 3):
        lag_df[f'Vehicles_lag_{i}'] = tempdf.Vehicles.shift(i)

    # drop all rows with nan, because lag data cause nan
    lag_df.dropna(inplace=True)

    lag_data = get_list_data(lag_df, drop=['Year'])
    # print("lag data: ", lag_data)

    # lag_models = [None]
    # print("testRatio in predict: ", testRatio)

    lag_models = Model(
            ml_model=RandomForestRegressor(),
            name=f'Dataset of junction {i} with lag data',
            data=lag_data[i],
            predict_features='Vehicles',
            test_size=testRatio
        )
    
    # print("score: ")
    print(lag_models.r2)
    print(type(lag_models.r2))
    global accuracyScore
    accuracyScore = lag_models.r2
    print(lag_models)
    print(type(lag_models))
    print(lag_models.cal_r2_score)
    print(type(lag_models.cal_r2_score))

    cur_time = lag_data[junction].tail(1).index[0] # get the current time, the last time of that dataset
    print(cur_time)
    end_time = cur_time + pd.DateOffset(days=days) # the end time after 4 months that we want to predict
    print(end_time)
    new_data = lag_data[junction].copy() # create a copy of dataset with that junction
    # print("new_data.shape")
    # print(new_data.shape)
    initialNumberOfRows = new_data.shape[0]
    print('here')
    features = lag_models.features # get features of each models in that junction
    time_period = []
    while cur_time != end_time:
        print(cur_time, end_time)
        time_period.append(cur_time)
        last = new_data.tail(1).copy() # get the last row of dataset, just make a copy!
        new_data = pd.concat([new_data, last]) # concatenate the copy dataset with it's last row
        for i in range(1, 3): # create lag data
            new_data[f'Vehicles_lag_{i}'] = new_data.Vehicles.shift(i) # shift by periods i
        new_data.iloc[len(new_data) - 1, [1, 2, 3]] = [cur_time.month, cur_time.day, cur_time.hour] # assign value for those columns
        last = new_data[features].tail(1).values # create a new last data that drop all nan
        new_data.iloc[len(new_data) - 1, 0] = round(lag_models.ml_model.predict(last)[0]) # predicting for vehicles
        cur_time += timedelta(minutes=60) # add to a cur_time 1 hour
    print("len time_period")
    print(len(time_period))
    # print(new_data)
    # new_data.index = pd.date_range(
    #     start=cur_time,
    #     end=end_time,
    #     freq='H'
    # )
    # new_data.index = time_period
    print('here3')# reassign index with the new time range with start is the start of data
    # and end time is the end time that initialize in start of the loop
    # new_data.to_csv(f'C:/Users/Acer/programs/vehicles_for_next_4_months_in_junction_{junction}.csv') # to csv that file
    # print(f'|==Predicted for Junction {junction}==|')

    # new_data = pd.read_csv('C:/Users/Acer/programs/vehicles_for_next_4_months_in_junction_' + str(junction) + '.csv')
    # print('newdata:\n', new_data.head(), '\n')
    new_data = new_data[initialNumberOfRows:]
    new_data.index = time_period
    print("new_data")
    print(new_data)
    print("len new_data")
    print(len(new_data))
    # print(new_data.head())
    new_data['DateTime'] = new_data.index
    # print("new_data.shape")
    # print(new_data.shape)
    junctionarr = []
    for i in range(new_data.shape[0]):
        junctionarr.append(junction)
    series = pd.Series(junctionarr)
    # print("series:", series)
    new_data['Junction'] = junctionarr
    # print("new_data.head(): ")
    # print(new_data.head())

    year = []
    for i in range(new_data.shape[0]):
        year.append(2017)
    series2 = pd.Series(year)
    new_data['Year'] = year
    new_data = new_data.set_index('DateTime')
    # print("new_data.head(): ")
    # print(new_data.head())
    # print("new_data.tail(1):")
    # print(new_data.tail(1))
    # predictedImagePath = make_time_series_plot3(new_data, junction)
    # result = { "predictedImagePath": predictedImagePath }
    data = new_data[new_data['Junction'] == junction]
    # print("data")
    # print(data)
    data['DateTime'] = data.index
    data = data.drop(['Vehicles_lag_1', 'Vehicles_lag_2'], axis='columns')
    data = data.reset_index(drop=True)
    global dfResult
    dfResult = data
    # print('with datetime')
    # print(data)
    # print("new_data:")
    # print(new_data, new_data.shape)
    # print("new_data[new_data[Junction] == junction]")
    # print(new_data[new_data['Junction'] == junction], new_data[new_data['Junction'] == junction].shape)
    # print("data: ")
    # print(data)
    print("data")
    print(data)
    vehicles = list(data['Vehicles'])
    # datetime = list(data['DateTime'])
    datetime = []
    for i in data['DateTime']:
        datetime.append(str(i))
    print('datetime')
    print(datetime)
    dictionary = dict()
    dictionary['vehicles'] = vehicles
    dictionary['datetime'] = datetime
    result = [dictionary]
    return make_response(result)
    # return make_response(result)


if __name__ == "__main__":
    app.run()
