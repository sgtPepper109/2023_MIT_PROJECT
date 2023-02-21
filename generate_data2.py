import sys
import numpy as np
import pandas as pd
import os
from datetime import datetime, timedelta, date
import datetime
from matplotlib.dates import DateFormatter


if __name__ == '__main__':
    df = pd.read_csv('traffic_hourly.csv')
    df['DateTime'] = pd.to_datetime(df['DateTime'])
    junction1 = df[df['Junction'] == 1]
    junction2 = df[df['Junction'] == 2]
    junction3 = df[df['Junction'] == 3]
    junction4 = df[df['Junction'] == 4]
    startJunction1 = junction1.head(1)
    startJunction2 = junction2.head(1)
    startJunction3 = junction3.head(1)
    startJunction4 = junction4.head(1)

    startJunction1Index = startJunction1.index[0]
    startJunction2Index = startJunction2.index[0]
    startJunction3Index = startJunction3.index[0]
    startJunction4Index = startJunction4.index[0]

    aheadJunction1 = startJunction1.DateTime[startJunction1Index] + pd.DateOffset(days=1)
    print(junction1[junction1['DateTime'] == aheadJunction1])

    while 1:
        aheadJunction1 = startJunction1.DateTime[startJunction1Index] + pd.DateOffset(days=1)
        print(junction1[junction1['DateTime'] == aheadJunction1])
        try:
            startJunction1 = junction1[junction1['DateTime'] == aheadJunction1]
        except:
            break[]
