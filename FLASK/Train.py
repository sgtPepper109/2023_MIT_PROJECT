import numpy as np
import pandas as pd
from datetime import datetime, timedelta, date
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge, Lasso, BayesianRidge, Lars, ElasticNet, OrthogonalMatchingPursuit, ARDRegression, SGDRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import r2_score
from sklearn.tree import DecisionTreeRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.ensemble import AdaBoostClassifier
import sklearn.metrics as metrics


class Train:
    def __init__(self, data, algorithm: str, junction: str, test_size: float):
        # constructor
        self.table_data = None
        self.to_predict = None
        self.date_time = None
        self.time = None
        self.test_against = None
        self.median_absolute_error = None
        self.mean_squared_error = None
        self.mean_absolute_error = None
        self.explained_variance = None
        self.r2 = None
        self.accuracy_score = None
        self.difference = None
        self.predicted = None
        self.actual = None
        self.new_ytest = None
        self.when_trained = None
        self.model = None
        self.model_trained_on_complete_dataset = None
        self.ytest = None
        self.ytrain = None
        self.xtest = None
        self.xtrain = None
        self.junction_data = None
        self.trained = False
        self.data = data
        self.algorithm = algorithm
        self.junction = junction
        self.test_size = test_size
        self.start_training_process()

    def append_and_start_training(self, new_data):
        new_data = new_data[new_data.Junction == self.junction]

        existing_data_datetime_column = []
        for i in range(len(self.junction_data.Year)):
            existing_data_datetime_column.append(datetime(self.data.Year[i], self.data.Month[i], self.data.Day[i]))
        self.junction_data.index = existing_data_datetime_column

        new_data_datetime_column = []
        for i in range(len(new_data.Year)):
            new_data_datetime_column.append(datetime(new_data.Year[i], new_data.Month[i], new_data.Day[i]))
        new_data.index = new_data_datetime_column
        new_data.drop('Junction', axis=1, inplace=True)

        for i in new_data.index:
            if i in self.junction_data.index:
                self.junction_data = self.junction_data.drop(i)

        self.junction_data = pd.concat([self.junction_data, new_data])
        self.junction_data.index = pd.to_datetime(self.junction_data.index)
        self.split_data()
        self.training()
        self.actual_vs_predicted()

    def start_training_process(self):
        self.preprocess_data()
        self.split_data()
        self.training()
        self.actual_vs_predicted()

    def preprocess_data(self):
        # drop all null value records
        self.separate_junction_related_data()
        self.junction_data = self.junction_data.dropna()

    def separate_junction_related_data(self):
        self.junction_data = self.data[self.data.Junction == self.junction]
        self.junction_data = self.junction_data.drop(['Junction'], axis='columns')

    def split_data(self):
        x = self.junction_data.drop(['Pcu'], axis='columns')
        y = self.junction_data.Pcu
        self.xtrain, self.xtest, self.ytrain, self.ytest = train_test_split(x,  y,  test_size=self.test_size)

    def training(self):
        if self.algorithm == "Random Forest Regression":
            self.model_trained_on_complete_dataset = RandomForestRegressor()
            self.model = RandomForestRegressor()
        elif self.algorithm == "Gradient Boosting Regression":
            self.model_trained_on_complete_dataset = GradientBoostingRegressor()
            self.model = GradientBoostingRegressor()
        elif self.algorithm == "Linear Regression":
            self.model_trained_on_complete_dataset = LinearRegression()
            self.model = LinearRegression()
        elif self.algorithm == "Logistic Regression":
            self.model_trained_on_complete_dataset = LogisticRegression()
            self.model = LogisticRegression()
        elif self.algorithm == "Ridge Regression":
            self.model_trained_on_complete_dataset = Ridge(alpha=2.0)
            self.model = Ridge(alpha=2.0)
        elif self.algorithm == "Lasso Regression":
            self.model_trained_on_complete_dataset = Lasso(alpha=1.0)
            self.model = Lasso(alpha=1.0)
        elif self.algorithm == "Bayesian Ridge Regression":
            self.model_trained_on_complete_dataset = BayesianRidge()
            self.model = BayesianRidge()
        elif self.algorithm == "Decision Tree Regression":
            self.model_trained_on_complete_dataset = DecisionTreeRegressor(random_state=0)
            self.model = DecisionTreeRegressor(random_state=0)
        elif self.algorithm == "K Nearest Neighbors Regression":
            self.model_trained_on_complete_dataset = KNeighborsRegressor(n_neighbors=3)
            self.model = KNeighborsRegressor(n_neighbors=3)
        elif self.algorithm == "Support Vector Regression":
            self.model_trained_on_complete_dataset = SVR(kernel='rbf')
            self.model = SVR(kernel='rbf')
        elif self.algorithm == "Gaussian Process Regression":
            self.model_trained_on_complete_dataset = GaussianProcessRegressor(random_state=4)
            self.model = GaussianProcessRegressor(random_state=4)
        # elif self.algorithm == 'Ada Boost':

        elif self.algorithm == 'Lars':
            self.model_trained_on_complete_dataset = Lars(n_nonzero_coefs=5)
            self.model = Lars(n_nonzero_coefs=5)
        elif self.algorithm == 'Elastic-net':
            self.model_trained_on_complete_dataset = ElasticNet(alpha=0.5, l1_ratio=0.5)
            self.model = ElasticNet(alpha=0.5, l1_ratio=0.5)
        # elif self.algorithm == 'OMP':
        #     self.model_trained_on_complete_dataset = OrthogonalMatchingPursuit(n_nonzero_coefs=5)
        #     self.model = OrthogonalMatchingPursuit(n_nonzero_coefs=5)
        elif self.algorithm == 'ARD':
            self.model_trained_on_complete_dataset = ARDRegression()
            self.model = ARDRegression()
        elif self.algorithm == 'SGD':
            self.model_trained_on_complete_dataset = SGDRegressor()
            self.model = SGDRegressor()
        elif self.algorithm == 'MLP':
            self.model_trained_on_complete_dataset = MLPClassifier(hidden_layer_sizes=(5, 2), activation='relu', solver='adam', max_iter=1000, random_state=42)
            self.model = MLPClassifier(hidden_layer_sizes=(5, 2), activation='relu', solver='adam', max_iter=1000, random_state=42)


        complete_xtrain = self.junction_data.drop(['Pcu'], axis='columns')
        complete_ytrain = self.junction_data.Pcu
        self.model_trained_on_complete_dataset.fit(complete_xtrain, complete_ytrain)
        self.model.fit(self.xtrain, self.ytrain)
        self.trained = True
        self.when_trained = datetime.now()

    def actual_vs_predicted(self):
        xtest_index = list(self.xtest.index)
        xtest_index.sort()
        new_xtest = pd.DataFrame()

        years = list()
        months = list()
        days = list()
        hours = list()
        date_time = list()

        for i in xtest_index:
            date_time.append(i)
            years.append(i.year)
            months.append(i.month)
            days.append(i.day)
            hours.append(i.hour)

        new_xtest['Year'] = years
        new_xtest['Month'] = months
        new_xtest['Day'] = days
        new_xtest['Hour'] = hours
        new_xtest['DateTime'] = date_time
        new_xtest.index = new_xtest['DateTime']
        new_xtest = new_xtest.drop(['DateTime'], axis='columns')

        self.new_ytest = list()
        for i in new_xtest.index:
            self.new_ytest.append(self.ytest[i])

        self.new_ytest = pd.Series(self.new_ytest)
        self.new_ytest.index = new_xtest.index

        self.actual = self.new_ytest
        self.actual = list(self.actual)
        self.predicted = self.model.predict(new_xtest)
        self.predicted = list(self.predicted)

        self.difference = list()
        for i in range(len(self.actual)):
            self.difference.append(abs(self.actual[i] - self.predicted[i]))

        self.accuracy_score = self.model.score(new_xtest, self.new_ytest)
        self.r2 = r2_score(self.new_ytest, self.predicted)
        self.explained_variance = metrics.explained_variance_score(self.new_ytest, self.predicted)
        self.mean_absolute_error = metrics.mean_absolute_error(self.new_ytest, self.predicted)
        self.mean_squared_error = metrics.mean_squared_error(self.new_ytest, self.predicted)
        self.median_absolute_error = metrics.median_absolute_error(self.new_ytest, self.predicted)
        self.test_against = []
        for i in new_xtest.index:
            self.test_against.append(str(i))

    def construct_future_time_to_be_predicted(self, time_period: int, time_format: str, show_by: str, start_year: int):
        if start_year == 0:
            start_time = self.junction_data.tail(1).index[0]
            start_year = start_time.year + 1
        curr_time = pd.to_datetime(date(start_year, 1, 1))

        if time_format == "Days":
            end_time = curr_time + pd.DateOffset(days=time_period)
        elif time_format == "Months":
            end_time = curr_time + pd.DateOffset(months=time_period)
        else:
            end_time = curr_time + pd.DateOffset(years=time_period)

        self.time = list()

        while curr_time <= end_time:
            self.time.append(curr_time)
            if show_by == 'Hours':
                curr_time += timedelta(minutes=60)
            if show_by == 'Days':
                curr_time += timedelta(minutes=1440)
            if show_by == 'Weeks':
                curr_time += timedelta(days=7)
            if show_by == 'Months':
                curr_time += timedelta(days=30)
            if show_by == 'Years':
                curr_time += timedelta(days=365)

    def construct_future_data_to_be_predicted(self):
        self.to_predict = pd.DataFrame()
        years = list()
        months = list()
        days = list()
        hours = list()
        self.date_time = list()

        for i in self.time:
            self.date_time.append(i)
            years.append(i.year)
            months.append(i.month)
            days.append(i.day)
            hours.append(i.hour)

        self.to_predict['Year'] = years
        self.to_predict['Month'] = months
        self.to_predict['Day'] = days
        self.to_predict['Hour'] = hours
        self.to_predict['DateTime'] = self.date_time
        self.to_predict.index = self.to_predict['DateTime']
        self.to_predict = self.to_predict.drop(['DateTime'], axis='columns')

    def predict(self, time_period: int, time_format: str, show_by: str, start_year: int):

        if self.trained:
            self.construct_future_time_to_be_predicted(time_period, time_format, show_by, start_year)
            self.construct_future_data_to_be_predicted()

            future_dates_predicted = self.model_trained_on_complete_dataset.predict(
                self.to_predict)  # to_predict variable comes from data constructed
            self.table_data = self.to_predict.copy()

            column_date_time = list()
            for i in self.date_time:
                column_date_time.append(str(i))

            self.table_data['DateTime'] = column_date_time
            self.table_data = self.table_data.reset_index(drop=True)
            self.table_data['Pcu'] = list(future_dates_predicted)

            predicted_data = dict()
            predicted_data['vehicles'] = list(future_dates_predicted)

            to_predict_datetime = list()
            for i in self.to_predict.index:
                to_predict_datetime.append(str(i))
            predicted_data['datetime'] = to_predict_datetime

            return [predicted_data]
