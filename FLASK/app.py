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
    # df['Year'] = pd.Series(df.index).apply(lambda x: x.year).to_list()
    # # extract month from date
    # df['Month'] = pd.Series(df.index).apply(lambda x: x.month).to_list()
    # # extract day from date
    # df['Day'] = pd.Series(df.index).apply(lambda x: x.day).to_list()
    # # extract hour from date
    # df['Hour'] = pd.Series(df.index).apply(lambda x: x.hour).to_list()
    # df.drop('ID', axis=1, inplace=True)
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

if __name__ == "__main__":
    app.run()
