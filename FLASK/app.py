from flask import Flask, make_response
from flask_cors import CORS

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

app = Flask(__name__)
cors = CORS(app)

@app.route("/data")
def hello():
    arr = []
    data = pd.read_csv('C:/Users/Acer/traffic/traffic.csv')
    data = data.head()
    data2 = data.to_dict()
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
