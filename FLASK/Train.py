import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso, BayesianRidge
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score
import sklearn.metrics as metrics


class Train:
    def __init__(self, data, algorithm: str, junction: str, testSize: float):
        #constructor
        self.trained = False
        self.data = data
        self.algorithm = algorithm
        self.junction = junction
        self.testSize = testSize
        self.startTrainingProcess()
    
    def startTrainingProcess(self):
        self.preprocessData()
        self.splitData()
        self.training()
        self.actualVsPredicted()
    
    def preprocessData(self):
        # drop all null value records
        self.separateJunctionRelatedData()
        self.junctionData = self.junctionData.dropna()

    def separateJunctionRelatedData(self):
        self.junctionData = self.data[self.data.Junction == self.junction]
        self.junctionData = self.junctionData.drop(['Junction'], axis='columns')

    def splitData(self):
        self.x = self.junctionData.drop(['Vehicles'], axis='columns')
        self.y = self.junctionData.Vehicles
        self.xtrain, self.xtest, self.ytrain, self.ytest = train_test_split(self.x, self.y, test_size = self.testSize)

    def training(self):
        if self.algorithm == "Random Forest Regression":
            self.model = RandomForestRegressor()
        elif self.algorithm == "Gradient Boosting Regression":
            self.model = GradientBoostingRegressor()
        elif self.algorithm == "Linear Regression":
            self.model = LinearRegression()
        elif self.algorithm == "Logistic Regression":
            self.model = LogisticRegression()
        elif self.algorithm == "Ridge Regression":
            self.model = Ridge(alpha=1.0)
        elif self.algorithm == "Lasso Regression":
            self.model = Lasso(alpha=1.0)
        elif self.algorithm == "Bayesian Ridge Regression":
            self.model = BayesianRidge()

        self.model.fit(self.xtrain, self.ytrain)
        self.trained = True
        self.whenTrained = datetime.now()


    def actualVsPredicted(self):
        self.xtestIndex = list(self.xtest.index)
        self.xtestIndex.sort()
        self.newXtest = pd.DataFrame()
        
        self.years = list()
        self.months = list()
        self.days = list()
        self.hours = list()
        self.dateTime = list()
        
        for i in self.xtestIndex:
            self.dateTime.append(i)
            self.years.append(i.year)
            self.months.append(i.month)
            self.days.append(i.day)
            self.hours.append(i.hour)

        self.newXtest['Year'] = self.years
        self.newXtest['Month'] = self.months
        self.newXtest['Day'] = self.days
        self.newXtest['Hour'] = self.hours
        self.newXtest['DateTime'] = self.dateTime
        self.newXtest.index = self.newXtest['DateTime']
        self.newXtest = self.newXtest.drop(['DateTime'], axis='columns')

        self.newYtest = list()
        for i in self.newXtest.index:
            self.newYtest.append(self.ytest[i])        

        self.newYtest = pd.Series(self.newYtest)
        self.newYtest.index = self.newXtest.index

        self.actual = self.newYtest
        self.predicted = self.model.predict(self.newXtest)
        self.actual = list(self.actual)
        self.predicted = list(self.predicted)

        self.difference = list()
        for i in range(len(self.actual)):
            self.difference.append(abs(self.actual[i] - self.predicted[i]))

        self.accuracyScore = self.model.score(self.newXtest, self.newYtest)
        self.r2 = r2_score(self.newYtest, self.predicted)
        self.explaindVariance = metrics.explained_variance_score(self.newYtest, self.predicted)
        self.meanAbsoluteError = metrics.mean_absolute_error(self.newYtest, self.predicted)
        self.meanSquaredError = metrics.mean_squared_error(self.newYtest, self.predicted)
        self.medianAbsoluteError = metrics.median_absolute_error(self.newYtest, self.predicted)
        self.testAgainst = []
        for i in self.newXtest.index:
            self.testAgainst.append(str(i))
        

    def constructFutureTimeToBePredicted(self, timePeriod: int, timeFormat: str, showBy: str):
        self.currTime = self.junctionData.tail(1).index[0]
        
        if timeFormat == "Days":
            self.endTime = self.currTime + pd.DateOffset(days=timePeriod) 
        elif timeFormat == "Months":
            self.endTime = self.currTime + pd.DateOffset(months=timePeriod) 
        else:
            self.endTime = self.currTime + pd.DateOffset(years=timePeriod) 

        self.time = list()
        # print("currTime: ", self.currTime)
        # print("endTime: ", self.endTime)

        temp = self.currTime
        # while temp != self.endTime or temp < self.endTime:
        #     print(temp)
        #     temp += timedelta(days=30)

        while self.currTime <= self.endTime:
            self.time.append(self.currTime)
            if showBy == 'Hours':
                self.currTime += timedelta(minutes=60)
            if showBy == 'Days':
                self.currTime += timedelta(minutes=1440)
            if showBy == 'Weeks':
                self.currTime += timedelta(days=7)
            if showBy == 'Months':
                self.currTime += timedelta(days=30)

    def constructFutureDataToBePredicted(self):
        self.toPredict = pd.DataFrame()
        self.years = list()
        self.months = list()
        self.days = list()
        self.hours = list()
        self.dateTime = list()
        
        for i in self.time:
            self.dateTime.append(i)
            self.years.append(i.year)
            self.months.append(i.month)
            self.days.append(i.day)
            self.hours.append(i.hour)

        self.toPredict['Year'] = self.years
        self.toPredict['Month'] = self.months
        self.toPredict['Day'] = self.days
        self.toPredict['Hour'] = self.hours
        self.toPredict['DateTime'] = self.dateTime
        self.toPredict.index = self.toPredict['DateTime']
        self.toPredict = self.toPredict.drop(['DateTime'], axis='columns')


    def predict(self, timePeriod: int, timeFormat: str, showBy: str):

        # returns predicted data for given timePeriod and timeFormat (e.g. 2, 'Days')

        if self.trained:
            self.constructFutureTimeToBePredicted(timePeriod, timeFormat, showBy)
            self.constructFutureDataToBePredicted()

            self.futureDatesPredicted = self.model.predict(self.toPredict)  # toPredict variable comes from data constructed
            self.tableData = self.toPredict.copy()

            self.columnDateTime = list()
            for i in self.dateTime:
                self.columnDateTime.append(str(i))

            self.tableData['DateTime'] = self.columnDateTime
            self.tableData = self.tableData.reset_index(drop=True)
            self.tableData['Vehicles'] = list(self.futureDatesPredicted)

            self.predictedData = dict()
            self.predictedData['vehicles'] = list(self.futureDatesPredicted)

            self.toPredictDateTime = list()
            for i in self.toPredict.index:
                self.toPredictDateTime.append(str(i))
            self.predictedData['datetime'] = self.toPredictDateTime

            return [self.predictedData]
        
    def customDatePrediction(self, datetime):
        if self.trained:
            self.singleToPredict = pd.DataFrame()
            self.years = list()
            self.months = list()
            self.days = list()
            self.hours = list()
            self.dateTime = list()
            
            self.dateTime.append(datetime)
            self.years.append(datetime.year)
            self.months.append(datetime.month)
            self.days.append(datetime.day)
            self.hours.append(datetime.hour)

            self.singleToPredict['Year'] = self.years
            self.singleToPredict['Month'] = self.months
            self.singleToPredict['Day'] = self.days
            self.singleToPredict['Hour'] = self.hours
            self.singleToPredict['DateTime'] = self.dateTime
            self.singleToPredict.index = self.singleToPredict['DateTime']
            self.singleToPredict = self.singleToPredict.drop(['DateTime'], axis='columns')
            self.predictedSingle = self.model.predict(self.singleToPredict)
            return self.predictedSingle