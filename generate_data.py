import sys
import numpy as np
import pandas as pd
import os
from datetime import datetime, timedelta, date
import datetime
from matplotlib.dates import DateFormatter


if __name__ == '__main__':
    times = sys.argv[1:]

    startTime = '2015-11-01 01:00:00'
    startTime = pd.to_datetime(startTime)

    data = list()
    for i in times:

        csvData = pd.DataFrame()
        for junction in range(1, 5):
            tempdf = pd.DataFrame()
            if i == 'daily' or i == 'days':
                entries = 1000
                timeskip = 1
                decidedEndTime = startTime + pd.DateOffset(days=entries)
            if i == 'weekly' or i == 'weeks':
                entries = 100
                timeskip = 7
                decidedEndTime = startTime + pd.DateOffset(days=entries * 7)
            if i == 'monthly' or i == 'months':
                entries = 24
                timeskip = 30
                decidedEndTime = startTime + pd.DateOffset(days=entries * 30)

            time_period = list()

            startTimeCopy = startTime
            while startTimeCopy != decidedEndTime:
                time_period.append(startTimeCopy)
                startTimeCopy += timedelta(days=timeskip)
            
            vehicles = list()
            for j in range(len(time_period)):
                vehicles.append(np.random.choice(np.arange(100)))

            ids = list()
            for k in range(len(time_period)):
                ids.append(np.random.choice(np.arange(100)))

            junctions = list()
            junctions = [junction for i in range(entries)]

            tempdf['DateTime'] = time_period
            tempdf['Junction'] = junctions
            tempdf['Vehicles'] = vehicles
            tempdf['ID'] = ids
            if csvData.empty:
                csvData = tempdf
            else:
                csvData = pd.concat([csvData, tempdf])
        csvData.to_csv('traffic_' + i + '.csv', index=False)