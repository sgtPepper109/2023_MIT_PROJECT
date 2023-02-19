import sys
import numpy as np
import pandas as pd
import os
from datetime import datetime, timedelta, date
import datetime
from matplotlib.dates import DateFormatter


if __name__ == '__main__':
    times = sys.argv[1:]

    startTime = datetime.datetime.now()

    data = list()
    for i in times:
        if i == 'daily' or i == 'days':
            daysData = pd.DataFrame()
            numberOfDays = 100

            decidedEndTime = startTime + pd.DateOffset(days=numberOfDays)
            time_period = list()

            startTimeCopy = startTime
            while startTimeCopy != decidedEndTime:
                time_period.append(startTimeCopy)
                startTimeCopy += timedelta(days=1)
            
            daysData['DateTime'] = time_period
            vehicles = list()
            for i in range(len(time_period)):
                vehicles.append(np.random.choice(np.arange(100)))
            daysData['Vehicles'] = vehicles
            daysData.to_csv('traffic_daily.csv')
            print(daysData)
        
        if i == 'weekly' or i == 'weeks':
            weeksData = pd.DataFrame()
            numberOfWeeks = 50

            decidedEndTime = startTime + pd.DateOffset(days=numberOfWeeks * 7)
            time_period = list()

            startTimeCopy = startTime
            while startTimeCopy != decidedEndTime:
                time_period.append(startTimeCopy)
                startTimeCopy += timedelta(days=7)
            weeksData['DateTime'] = time_period
            vehicles = list()
            for i in range(len(time_period)):
                vehicles.append(np.random.choice(np.arange(100)))
            weeksData['Vehicles'] = vehicles
            weeksData.to_csv('traffic_weekly.csv')
            print(weeksData)