import numpy as np
import pandas as pd
from datetime import datetime, timedelta, date
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso, BayesianRidge
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score
from sklearn.tree import DecisionTreeRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.preprocessing import PolynomialFeatures
import sklearn.metrics as metrics
from statistics import *


class Train:
    def __init__(self, data, algorithm: str, junction: str, testSize: float):
        #constructor
        self.trained = False
        self.data = data
        self.algorithm = algorithm
        self.junction = junction
        self.testSize = testSize
        # print("self.testSize", self.testSize)
        self.startTrainingProcess()
    
    def appendAndStartTraining(self,newData):
        newData = newData[newData.Junction == self.junction]

        existingDataDateTimeColumn = []
        for i in range(len(self.junctionData.Year)):
            existingDataDateTimeColumn.append(datetime(self.data.Year[i], self.data.Month[i], self.data.Day[i]))
        self.junctionData.index = existingDataDateTimeColumn

        newDataDateTimeColumn = []
        for i in range(len(newData.Year)):
            newDataDateTimeColumn.append(datetime(newData.Year[i], newData.Month[i], newData.Day[i]))
        newData.index = newDataDateTimeColumn
        newData.drop('Junction', axis=1, inplace=True)

        for i in newData.index:
            if i in self.junctionData.index:
                self.junctionData = self.junctionData.drop(i)

        self.junctionData = pd.concat([self.junctionData, newData])
        self.junctionData.index = pd.to_datetime(self.junctionData.index)
        self.splitData()
        self.training()
        self.actualVsPredicted()

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
            self.model2 = RandomForestRegressor()
            self.model = RandomForestRegressor()
        elif self.algorithm == "Gradient Boosting Regression":
            self.model2 = GradientBoostingRegressor()
            self.model = GradientBoostingRegressor()
        elif self.algorithm == "Linear Regression":
            self.model2 = LinearRegression()
            self.model = LinearRegression()
        elif self.algorithm == "Logistic Regression":
            self.model2 = LogisticRegression()
            self.model = LogisticRegression()
        elif self.algorithm == "Ridge Regression":
            self.model2 = Ridge(alpha=2.0)
            self.model = Ridge(alpha=2.0)
        elif self.algorithm == "Lasso Regression":
            self.model2 = Lasso(alpha=1.0)
            self.model = Lasso(alpha=1.0)
        elif self.algorithm == "Bayesian Ridge Regression":
            self.model2 = BayesianRidge()
            self.model = BayesianRidge()
        elif self.algorithm == "Decision Tree Regression":
            self.model2 = DecisionTreeRegressor(random_state=0)
            self.model = DecisionTreeRegressor(random_state=0)
        elif self.algorithm == "K Nearest Neighbors Regression":
            self.model2 = KNeighborsRegressor(n_neighbors=3)
            self.model = KNeighborsRegressor(n_neighbors=3)
        elif self.algorithm == "Support Vector Regression":
            self.model2 = SVR(kernel='rbf')
            self.model = SVR(kernel='rbf')
        elif self.algorithm == "Gaussian Process Regression":
            self.model2 = GaussianProcessRegressor(random_state=4)
            self.model = GaussianProcessRegressor(random_state=4)


        self.completeXtrain = self.junctionData.drop(['Vehicles'], axis='columns')
        self.completeYtrain = self.junctionData.Vehicles
        self.model2 .fit(self.completeXtrain, self.completeYtrain)
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
        

    def constructFutureTimeToBePredicted(self, timePeriod: int, timeFormat: str, showBy: str, startYear: str):
        self.currTime = self.junctionData.tail(1).index[0]
        self.currTime = pd.to_datetime(date(2018, 1, 1))
        
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
            if showBy == 'Years':
                self.currTime += timedelta(days=365)

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


    def predict(self, timePeriod: int, timeFormat: str, showBy: str, startYear: int):

        # returns predicted data for given timePeriod and timeFormat (e.g. 2, 'Days')

        if self.trained:
            self.constructFutureTimeToBePredicted(timePeriod, timeFormat, showBy, startYear)
            self.constructFutureDataToBePredicted()

            self.futureDatesPredicted = self.model2.predict(self.toPredict)  # toPredict variable comes from data constructed
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

    
    def getRelativeChange(self, relativeChange, factor):
        self.vehicles = self.junctionData.Vehicles

        if factor == 'Mean (Average)':
            self.modeValue = mean(self.vehicles)
        if factor == 'Mode':
            self.modeValue = mode(self.vehicles)
        if factor == 'Median':
            self.modeValue = median(self.vehicles)
        if factor == 'First Prediction Instance':
            self.modeValue = self.futureDatesPredicted[0]
        if factor == 'Last pcu observation':
            self.modeValue = self.junctionData.tail(1).Vehicles[self.junctionData.tail(1).index[0]]

        # self.modeValue = median(self.vehicles)
        # self.modeValue = self.junctionData.tail(1).Vehicles[self.junctionData.tail(1).index[0]]
        # self.modeValue = self.futureDatesPredicted[0]
        # print(self.futureDatesPredicted[0])
        # self.modeValue = mode(self.vehicles)
        self.increasingVehiclesNumber = (relativeChange / 100) * mode(self.vehicles)
        self.currentYear = self.time[0]
        self.currVehiclesNumber = self.increasingVehiclesNumber
        self.array = list()
        for i in self.time:
            self.array.append(self.currVehiclesNumber)
            strYear = str(i)[:4]
            if strYear != str(self.currentYear)[:4]:
                self.currentYear = i
                self.currVehiclesNumber += self.increasingVehiclesNumber

        self.lastElement = self.array[-1]
        self.firstElement = self.array[0]

        self.difference = self.lastElement - self.firstElement
        self.array2 = list()
        for i in range(len(self.array)):
            self.firstElement += (self.difference / len(self.array))
            self.array2.append(self.firstElement)


        self.array3 = list()
        for i in self.array2:
            i += (self.modeValue - self.increasingVehiclesNumber)
            self.array3.append(i)
        
        if factor == 'First Prediction Instance':
            self.adjust = self.array3[0] - self.futureDatesPredicted[0]
            self.array4 = list()
            for i in self.array3:
                self.array4.append(i - self.adjust)
            return self.array4
        else:
            return self.array3
                