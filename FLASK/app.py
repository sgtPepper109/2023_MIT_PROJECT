from flask import Flask, make_response
from flask_cors import CORS

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


guiAssetsFolder = 'C:/Users/Acer/2023MitProject/GUI/src/assets/'
for file in os.listdir(guiAssetsFolder):
    os.remove(os.path.join(guiAssetsFolder, file))


arr = []
df = pd.read_csv('C:/Users/Acer/Downloads/traffic.csv')
tempdf = pd.read_csv('C:/Users/Acer/Downloads/traffic.csv', parse_dates=True, index_col='DateTime')
tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
# extract month from date
tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
# extract day from date
tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
# extract hour from date
tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()
tempdf.drop('ID', axis=1, inplace=True)

year = np.array(tempdf['Year'])
month = np.array(tempdf['Month'])
day = np.array(tempdf['Day'])
hour = np.array(tempdf['Hour'])

df['Year'] = year
df['Month'] = month
df['Day'] = day
df['Hour'] = hour

head = df.head()
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


@app.route("/data")
def hello():
    
    # print(df)
    return make_response(arr)


def histogram(df, junction):
    temp = df[df['Junction'] == junction]
    f, ax = plt.subplots(figsize=(17, 5))
    ax = sns.histplot(temp['Vehicles'], kde=True, stat='probability')
    ax.set_title(f'Plot show the distribution of data in junction {junction}')
    ax.grid(True, ls='-.', alpha=0.75)
    path = 'C:/Users/Acer/2023MitProject/GUI/src/assets/histogram' + str(junction) + '.png'
    plt.savefig(path)
    return path


@app.route("/plot")
def plot():

    # print('\n', df.head(2), '\n')
    # print(junction, '\n')

    # temp = df[df['Junction'] == 2]
    # f, ax = plt.subplots(figsize=(17, 5))
    # ax = sns.histplot(temp['Vehicles'], kde=True, stat='probability')
    # ax.set_title('Plot show the distribution of data in junction 2')
    # ax.grid(True, ls='-.', alpha=0.75)
    # plt.savefig('C:/Users/Acer/2023MitProject/GUI/src/assets/histogram1.png')
    # df = pd.read_csv('C:/Users/Acer/Downloads/traffic.csv')
    # tempdf = pd.read_csv('C:/Users/Acer/Downloads/traffic.csv', parse_dates=True, index_col='DateTime')
    # tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
    # # extract month from date
    # tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
    # # extract day from date
    # tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
    # # extract hour from date
    # tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()
    # tempdf.drop('ID', axis=1, inplace=True)

    # year = np.array(tempdf['Year'])
    # month = np.array(tempdf['Month'])
    # day = np.array(tempdf['Day'])
    # hour = np.array(tempdf['Hour'])

    # df['Year'] = year
    # df['Month'] = month
    # df['Day'] = day
    # df['Hour'] = hour
    global df
    global tempdf
    
    savedFigFor1 = histogram(df, 1)
    savedFigFor2 = histogram(df, 2)
    savedFigFor3 = histogram(df, 3)
    savedFigFor4 = histogram(df, 4)
    result = {
        "junction1plot": savedFigFor1,
        "junction2plot": savedFigFor2,
        "junction3plot": savedFigFor3,
        "junction4plot": savedFigFor4,
    }
    # print(result)
    return make_response(result)


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
    ax.set_title(f'Plot show amounts of Vehicles in junction {junction} from {start.Month[0]}-{start.Year[0]} to {end.Month[0]}-{end.Year[0]}', fontsize=15)
    ax.grid(True, ls='-.', alpha=0.75)
    path = 'C:/Users/Acer/2023MitProject/GUI/src/assets/predicted' + str(junction) + '.png'
    plt.savefig(path)
    return path


@app.route('/predict/<junction>/<months>')
def predict(junction=None, months=None):
    # df = pd.read_csv('C:/Users/Acer/Downloads/traffic.csv')
    # tempdf = pd.read_csv('C:/Users/Acer/Downloads/traffic.csv', parse_dates=True, index_col='DateTime')
    # tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
    # # extract month from date
    # tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
    # # extract day from date
    # tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
    # # extract hour from date
    # tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()
    # tempdf.drop('ID', axis=1, inplace=True)

    # year = np.array(tempdf['Year'])
    # month = np.array(tempdf['Month'])
    # day = np.array(tempdf['Day'])
    # hour = np.array(tempdf['Hour'])

    # df['Year'] = year
    # df['Month'] = month
    # df['Day'] = day
    # df['Hour'] = hour
    global df
    global tempdf
    junction = int(junction)
    months = int(months)
    print('\n', junction, '\n')
    standardization = lambda x: StandardScaler().fit_transform(x)
    z_df = tempdf.copy()
    z_df['Vehicles'] = standardization(z_df.Vehicles.values.reshape(-1, 1))
    z_df.head()
    data = get_list_data(tempdf)
    z_data = get_list_data(z_df)

    models = [None]
    for i in range(1, 5):
        models += [
            Model(
                ml_model=RandomForestRegressor(),
                name=f'Dataset of junction {i}',
                data=data[i],
                predict_features='Vehicles',
                test_size=1/4
            )
        ]
    
    z_models = [None]
    for i in range(1, 5):
        z_models += [
            Model(
                ml_model=RandomForestRegressor(),
                name=f'Dataset of junction {i}',
                data=z_data[i],
                predict_features='Vehicles',
                test_size=1/4
            )
        ]
    
    lag_df = tempdf.copy()
    for i in range(1, 3):
        lag_df[f'Vehicles_lag_{i}'] = tempdf.Vehicles.shift(i)

    # drop all rows with nan, because lag data cause nan
    lag_df.dropna(inplace=True)

    lag_data = get_list_data(lag_df, drop=['Year'])

    lag_models = [None]
    for i in range(1, 5):
        lag_models += [
            Model(
                ml_model=RandomForestRegressor(),
                name=f'Dataset of junction {i} with lag data',
                data=lag_data[i],
                predict_features='Vehicles',
                test_size=1/3
            )
        ]

    cur_time = lag_data[junction].tail(1).index[0] # get the current time, the last time of that dataset
    print(cur_time)
    end_time = cur_time + pd.DateOffset(months=months) # the end time after 4 months that we want to predict
    print(end_time)
    new_data = lag_data[junction].copy() # create a copy of dataset with that junction
    features = lag_models[junction].features # get features of each models in that junction
    while cur_time != end_time:
        last = new_data.tail(1).copy() # get the last row of dataset, just make a copy!
        new_data = pd.concat([new_data, last]) # concatenate the copy dataset with it's last row
        for i in range(1, 3): # create lag data
            new_data[f'Vehicles_lag_{i}'] = new_data.Vehicles.shift(i) # shift by periods i
        new_data.iloc[len(new_data) - 1, [1, 2, 3]] = [cur_time.month, cur_time.day, cur_time.hour] # assign value for those columns
        last = new_data[features].tail(1).values # create a new last data that drop all nan
        new_data.iloc[len(new_data) - 1, 0] = round(lag_models[1].ml_model.predict(last)[0]) # predicting for vehicles
        cur_time += timedelta(hours=1) # add to a cur_time 1 hour
    new_data.index = pd.date_range(
        start=lag_data[junction].head(1).index.values[0],
        end=end_time,
        freq='H'
    ) # reassign index with the new time range with start is the start of data
    # and end time is the end time that initialize in start of the loop
    new_data.to_csv(f'C:/Users/Acer/programs/vehicles_for_next_4_months_in_junction_{junction}.csv') # to csv that file
    print(f'|==Predicted for Junction {junction}==|')

    new_data = pd.read_csv('C:/Users/Acer/programs/vehicles_for_next_4_months_in_junction_' + str(junction) + '.csv')
    print('\n', new_data.head(), '\n')
    new_data['DateTime'] = new_data['Unnamed: 0']
    junctionarr = []
    for i in range(new_data.shape[0]):
        junctionarr.append(junction)
    series = pd.Series(junctionarr)
    new_data['Junction'] = series
    year = []
    for i in range(new_data.shape[0]):
        year.append(2017)
    series2 = pd.Series(year)
    new_data['Year'] = year
    new_data = new_data.set_index('DateTime')
    # print(new_data.tail(1))
    predictedImagePath = make_time_series_plot3(new_data, junction)
    result = { "predictedImagePath": predictedImagePath }
    return make_response(result)


if __name__ == "__main__":
    app.run()
