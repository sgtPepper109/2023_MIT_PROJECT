from flask import Flask, make_response
from flask_cors import CORS

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



@app.route("/data")
def hello():
    arr = []
    df = pd.read_csv('C:/Users/Acer/traffic/traffic.csv')
    tempdf = pd.read_csv('C:/Users/Acer/traffic/traffic.csv', parse_dates=True, index_col='DateTime')
    tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
    # extract month from date
    tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
    # extract day from date
    tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
    # extract hour from date
    tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()
    tempdf.drop('ID', axis=1, inplace=True)

    year = tempdf['Year']
    month = tempdf['Month']
    day = tempdf['Day']
    hour = tempdf['Hour']

    year = np.array(year)
    month = np.array(month)
    day = np.array(day)
    hour = np.array(hour)

    df['Year'] = year
    df['Month'] = month
    df['Day'] = day
    df['Hour'] = hour

    df = df.head()
    data2 = df.to_dict()
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




@app.route("/plot")
def plot():
    arr = []
    df = pd.read_csv('C:/Users/Acer/traffic/traffic.csv')
    tempdf = pd.read_csv('C:/Users/Acer/traffic/traffic.csv', parse_dates=True, index_col='DateTime')
    tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
    # extract month from date
    tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
    # extract day from date
    tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
    # extract hour from date
    tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()
    tempdf.drop('ID', axis=1, inplace=True)

    year = tempdf['Year']
    month = tempdf['Month']
    day = tempdf['Day']
    hour = tempdf['Hour']

    year = np.array(year)
    month = np.array(month)
    day = np.array(day)
    hour = np.array(hour)

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
    
    temp = df[df['Junction'] == 2]
    f, ax = plt.subplots(figsize=(17, 5))
    ax = sns.histplot(temp['Vehicles'], kde=True, stat='probability')
    ax.set_title('Plot show the distribution of data in junction 2')
    ax.grid(True, ls='-.', alpha=0.75)
    plt.savefig('C:/Users/Acer/2023MitProject/GUI/src/assets/histogram1.png')
    result = {"data": "C:/Users/Acer/2023MitProject/GUI/src/assets/histogram1/png"}
    return make_response(result)


if __name__ == "__main__":
    app.run()
