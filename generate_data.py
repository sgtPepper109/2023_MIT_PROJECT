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

    trafficDaily = pd.read_csv('traffic_hourly.csv')
    trafficDaily.DateTime = pd.to_datetime(trafficDaily.DateTime)

    data = list()
    for i in times:

        csvData = pd.DataFrame()
        for junction in range(1, 5):
            tempdf = pd.DataFrame()
            decidedEndTime = '2017-06-30 01:00:00'
            decidedEndTime = pd.to_datetime(decidedEndTime)
            if i == 'daily' or i == 'days':
                entries = 1000
                timeskip = 1
            if i == 'weekly' or i == 'weeks':
                entries = 100
                timeskip = 7
            if i == 'monthly' or i == 'months':
                entries = 24
                timeskip = 30

            time_period = list()

            startTimeCopy = startTime
            while startTimeCopy != decidedEndTime:
                time_period.append(startTimeCopy)
                startTimeCopy += timedelta(days=timeskip)
            
            vehicles = list()
            # for j in range(len(time_period)):
            #     vehicles.append(np.random.choice(np.arange(100)))
            
            print(time_period[-2:])
            for j in time_period:
                # print(j)
                noOfVehicles = trafficDaily[trafficDaily['Junction'] == junction].Vehicles[trafficDaily.DateTime == j]
                # print(noOfVehicles)
                # print(j)
                try:
                    # print(noOfVehicles[noOfVehicles.index[0]])
                    noOfVehicles = noOfVehicles[noOfVehicles.index[0]]
                    vehicles.append(noOfVehicles)
                except:
                    continue

            ids = list()
            for k in range(len(time_period)):
                ids.append(np.random.choice(np.arange(100)))

            junctions = list()
            junctions = [junction for i in range(entries)]

            tempdf['DateTime'] = time_period[:len(vehicles)]
            tempdf['Junction'] = junctions[:len(vehicles)]
            tempdf['Vehicles'] = vehicles[:len(vehicles)]
            tempdf['ID'] = ids[:len(vehicles)]
            if csvData.empty:
                csvData = tempdf
            else:
                csvData = pd.concat([csvData, tempdf])

        print('hello')
        csvData.to_csv('traffic_' + i + '.csv', index=False)
        print('hello')