import sys
import collections
import Train
import requests
from flask import Flask, make_response, request
from flask_cors import CORS
import json
import config
import numpy as np
import pandas as pd
import scipy
from statsmodels.stats.stattools import jarque_bera, durbin_watson
from scipy.stats import skew, kurtosis
import exceptions
from datetime import datetime

app = Flask(__name__)
cors = CORS(app)
url_not_found_string = "Invalid URL"
algorithms = [
    'Linear Regression', 'Random Forest Regression', 'Gradient Boosting Regression', 'Ridge Regression',
    'Lasso Regression', 'Bayesian Ridge Regression', 'Decision Tree Regression',
    'K Nearest Neighbors Regression'
]


@app.route('/getAllAlgorithms')
def get_all_algorithms():
    return make_response(algorithms)


@app.route('/getEndYearFromDataset')
def get_end_year_from_dataset():
    global df
    response = list()
    end_date = list(df.DateTime)[-1]
    year = pd.to_datetime(end_date).year
    response.append(year)
    return make_response(response)


@app.route('/checkIfTrained')
def check_if_trained():
    global all_trained_data
    args = request.args
    args = args.to_dict()

    junction_to_check = args['junction']
    if "%20" in args['junction']:
        junction_to_check = args['junction'].replace("%20", " ")

    if junction_to_check in all_trained_data:
        return make_response([True])
    else:
        return make_response([False])


@app.route("/getCsvData")
def get_csv_data():
    # get/declare global variables
    global spring_url
    global df
    global tempdf
    global unique_junctions_in_dataset
    global type_of_data

    responseString = ""
    # sets 'False' if getting csv data from spring backend is unsuccessful
    success: bool = True
    url: str = spring_url + '/process/exchangeCsvData'
    url_response = None
    try:
        url_response: any = requests.get(url)
    except RuntimeError:
        exceptions.UrlNotFoundException(url_not_found_string)

    json_response: str = url_response.text
    csv_data: list = json.loads(json_response)

    df = pd.DataFrame()
    tempdf = pd.DataFrame()

    df = pd.DataFrame.from_dict(csv_data)
    df = df._convert(numeric=True)
    if 'ID' in df.columns:
        df.drop('ID', axis=1, inplace=True)

    tempdf = df.copy()

    try:
        tempdf['DateTime'] = pd.to_datetime(tempdf['DateTime'])
        tempdf = tempdf.set_index('DateTime')

        time_difference = tempdf.index[1] - tempdf.index[0]
        time_difference = str(time_difference)
        time_difference = int(time_difference.split(' ')[0])

        if time_difference == 0:
            type_of_data = 'Hours'
        elif time_difference == 1:
            type_of_data = 'Days'
        elif time_difference == 30:
            type_of_data = 'Months'

        tempdf['Year'] = pd.Series(tempdf.index).apply(lambda x: x.year).to_list()
        tempdf['Month'] = pd.Series(tempdf.index).apply(lambda x: x.month).to_list()
        tempdf['Day'] = pd.Series(tempdf.index).apply(lambda x: x.day).to_list()
        tempdf['Hour'] = pd.Series(tempdf.index).apply(lambda x: x.hour).to_list()

        if 'ID' in tempdf.columns:
            tempdf.drop('ID', axis=1, inplace=True)

        unique_junctions_in_dataset = list(np.unique(df.Junction))

        datetime_list = list(df.DateTime)
        duplicates: list = [item for item, count in collections.Counter(datetime_list).items() if count > 1]
        if duplicates == []:
            success = True
        else:
            success = False
            responseString = "Date-Time contains duplicates"

        current_timestamp = pd.to_datetime(datetime.now())
        for x in datetime_list:
            iter_timestamp = pd.to_datetime(x)
            if iter_timestamp > current_timestamp:
                success = False
                responseString = "Date-Time exceeding current date-time"
                break

        dictionary = dict()
        if success:
            dictionary['getCsvData'] = "success"
            return make_response(dictionary)
        else:
            dictionary['getCsvData'] = responseString
            return make_response(dictionary)
    except ValueError:
        exceptions.BreakDownException('Warning: Invalid dataset')
        dictionary = dict()
        dictionary['getCsvData'] = "Corrupted dataset"
        return make_response(dictionary)


@app.route('/getAllUniqueJunctions')
def get_all_unique_junctions():
    global unique_junctions_in_dataset
    return make_response(unique_junctions_in_dataset)


def create_dict(from_junction):
    global df
    data = df[df['Junction'] == from_junction]
    vehicles = list(data['Pcu'])
    datetime = list(data['DateTime'])
    dictionary = dict()
    dictionary['vehicles'] = vehicles
    dictionary['datetime'] = datetime
    return [dictionary]


@app.route("/plot")
def plot():
    global df
    global tempdf

    response = dict()
    for i in np.unique(df.Junction):
        response[i] = create_dict(i)
    return make_response(response)


def f_test(x: list, y: list):
    x = np.array(x)
    y = np.array(y)
    if np.var(y, ddof=1) == 0.0:
        f = np.var(x, ddof=1) / 0.01
    else:
        f = np.var(x, ddof=1) / np.var(y, ddof=1)  # calculate F test statistic
    dfn = x.size - 1  # define degrees of freedom numerator
    dfd = y.size - 1  # define degrees of freedom denominator
    p = 1 - scipy.stats.f.cdf(f, dfn, dfd)  # find p-value of F test statistic 
    return f, p


@app.route('/getAllModelSummaries')
def get_all_model_summaries():
    global all_trained_data

    all_model_summaries = dict()
    for algo in all_trained_data[junction]:
        model_summary_of_test_ratios = dict()
        for testratio in all_trained_data[junction][algo]:
            trained = all_trained_data[junction][algo][testratio]
            fstatistic = f_test(trained.new_ytest, trained.predicted)
            model_summary = [{'Property': 'Dependent Variable', 'Value': 'DateTime'},
                             {'Property': 'Algorithm', 'Value': trained.algorithm},
                             {'Property': 'Testing Ratio', 'Value': trained.test_size},
                             {'Property': 'Accuracy', 'Value': trained.accuracy_score},
                             {'Property': 'R-Squared', 'Value': trained.r2},
                             {'Property': 'Date & Time of Training', 'Value': trained.when_trained},
                             {'Property': 'No. of Observations', 'Value': trained.data.shape[0]},
                             {'Property': 'F-Statistic', 'Value': fstatistic[0]},
                             {'Property': '(prob) F-Statistic', 'Value': fstatistic[1]},
                             {'Property': 'Explained Variance', 'Value': trained.explained_variance},
                             {'Property': 'Mean Absolute Error', 'Value': trained.mean_absolute_error},
                             {'Property': 'Mean Squared Error', 'Value': trained.mean_squared_error},
                             {'Property': 'Median Absolute Error', 'Value': trained.median_absolute_error},
                             {'Property': 'Skew', 'Value': skew(list(trained.data.Pcu), axis=0, bias=True)},
                             {'Property': 'Kurtosis',
                              'Value': kurtosis(list(trained.data.Pcu), axis=0, bias=True)},
                             {'Property': 'Jarque-Bera (JB)',
                              'Value': str(jarque_bera(np.array(trained.data.Pcu)))},
                             {'Property': 'Durbin Watson', 'Value': durbin_watson(np.array(trained.data.Pcu))}
                             ]
            model_summary_of_test_ratios[testratio] = model_summary
        all_model_summaries[algo] = model_summary_of_test_ratios

    return make_response(all_model_summaries)


@app.route('/listenTime')
def listen_time():
    global spring_url
    success = True
    url = spring_url + '/process/exchangeTime'
    url_response = None

    try:
        url_response: any = requests.get(url)
    except RuntimeError:
        exceptions.UrlNotFoundException(url_not_found_string)
    json_response: str = url_response.text
    response: list = json.loads(json_response)

    global time
    global time_format
    global show_by

    time = response['timePeriod']
    time_format = response['timeFormat']
    if "showBy" in response:
        show_by = response['showBy']
    dictionary = dict()
    if success:
        dictionary['gotTime'] = "success"
        return make_response(dictionary)
    else:
        dictionary['gotTime'] = "fail"
        return make_response(dictionary)


@app.route('/predictForHighestAccuracy')
def predict_for_highest_accuracy():
    global all_trained_data
    global time
    global time_format
    global highest_accuracy_algorithm
    global highest_accuracy_test_ratio
    global highest_accuracy_trained
    global show_by
    global start_year
    global start_year_map
    args = request.args
    args = args.to_dict()

    highest_accuracy_algorithm = args['algorithm']
    if "%20" in highest_accuracy_algorithm:
        highest_accuracy_algorithm = highest_accuracy_algorithm.replace("%20", " ")
    highest_accuracy_test_ratio = float(args['testRatio'])
    which_junction = args['junction']
    if "%20" in args['junction']:
        which_junction = args['junction'].replace("%20", " ")

    highest_accuracy_trained = all_trained_data[which_junction][highest_accuracy_algorithm][highest_accuracy_test_ratio]
    plot_response = highest_accuracy_trained.predict(time, time_format, show_by, start_year)
    start_year_map[which_junction] = start_year
    return make_response(plot_response)


@app.route('/getStartYearMap')
def get_start_year_map():
    global start_year_map
    print(start_year_map)
    return make_response(start_year_map)


@app.route("/addToMaster")
def add_to_master():
    args = request.args
    args = args.to_dict()

    master_algorithm = args['algorithm']
    if "%20" in master_algorithm:
        master_algorithm = master_algorithm.replace("%20", " ")

    master_test_ratio = float(args['testRatio'])

    global master_algorithm_and_test_ratio_for_junction
    global all_trained_data
    global master_data
    global start_year

    master_junction = args['junction']
    if "%20" in args['junction']:
        master_junction = args['junction'].replace("%20", " ")
    start_year = int(args['startYear'])

    find_trained = all_trained_data[master_junction][master_algorithm][master_test_ratio]
    master_data[master_junction] = find_trained
    start_year_map[master_junction] = start_year
    return make_response(args)


@app.route("/getMasterTrainedDataPlot")
def get_master_trained_data_plot():
    global all_trained_data
    global master_data
    global time
    global time_format
    global master_data_table
    global master_junctions_accuracies
    global show_by
    global start_year

    master_data_table = dict()
    response = dict()
    master_junctions_accuracies = dict()
    for i in master_data:
        trained = master_data[i]
        response[i] = trained.predict(time, time_format, show_by, start_year)
        master_junctions_accuracies[i] = trained.accuracy_score

        table = []
        head = trained.table_data

        data2 = head.to_dict()
        anycol = ""
        for j in data2:
            anycol = j
            break
        for j in range(len(data2[anycol])):
            field = {}
            for k in data2:
                field[k] = data2[k][j]
            table.append(field)

        master_data_table[i] = table

    return make_response(response)


@app.route("/getMasterTrainedDataTable")
def get_master_trained_data_table():
    global master_data_table
    return make_response(master_data_table)


@app.route("/getMasterTrainedJunctionsAccuracies")
def get_master_trained_junctions_accuracies():
    global master_junctions_accuracies
    return make_response(master_junctions_accuracies)


@app.route('/getTestingRatioComparisons')
def get_testing_ratio_comparisons():
    global time
    global time_format
    global algorithm
    global tempdf
    global junction
    global all_trained_data

    args = request.args
    args = args.to_dict()

    junction = args['junction']
    if "%20" in junction:
        junction = junction.replace("%20", " ")

    action = args['action']

    possible_test_ratios = np.arange(0.1, 1, 0.1)

    response = dict()
    temp = dict()
    print(action)

    if action == 'clear':
        for i in algorithms:
            test_ratio_comparisons = dict()
            trained_data = dict()
            for j in possible_test_ratios:
                j = round(j, 3)
                trained = Train.Train(tempdf, i, junction, j)
                trained_data[j] = trained
                test_ratio_comparisons[j] = trained.accuracy_score
            response[i] = test_ratio_comparisons
            temp[i] = trained_data
    if action == 'append':
        new_data = tempdf.copy()
        for i in algorithms:
            test_ratio_comparisons = dict()
            trained_data = dict()
            for j in possible_test_ratios:
                j = round(j, 3)
                trained = all_trained_data[junction][i][j]
                trained.append_and_start_training(new_data)
                trained_data[j] = trained
                test_ratio_comparisons[j] = trained.accuracy_score
            response[i] = test_ratio_comparisons
            temp[i] = trained_data

    all_trained_data[junction] = temp
    return make_response(response)


@app.route('/getFuturePredictionsTable')
def get_future_predictions_table():
    global algorithm
    global highest_accuracy_trained
    arr = []
    head = highest_accuracy_trained.table_data

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
    return make_response(arr)


@app.route('/getActualVsPredictedComparison')
def get_actual_vs_predicted_comparison():
    global all_trained_data
    global junction

    all_actual_vs_predicted = dict()
    for algo in all_trained_data[junction]:
        actual_vs_predicted_for_test_ratio = dict()
        for testratio in all_trained_data[junction][algo]:
            trained = all_trained_data[junction][algo][testratio]
            actual_pred = dict()
            actual_pred['actual'] = trained.actual
            actual_pred['predicted'] = trained.predicted
            actual_pred['difference'] = trained.difference
            actual_pred['labels'] = trained.test_against
            actual_vs_predicted_for_test_ratio[testratio] = actual_pred
        all_actual_vs_predicted[algo] = actual_vs_predicted_for_test_ratio
    
    return make_response(all_actual_vs_predicted)


@app.route('/getActualVsPredictedComparisonTableData')
def get_actual_vs_predicted_comparison_table_data():
    global all_trained_data
    global junction

    all_actual_vs_predicted_table = dict()
    for algo in all_trained_data[junction]:
        actual_vs_predicted_for_test_ratio = dict()
        for testratio in all_trained_data[junction][algo]:
            trained = all_trained_data[junction][algo][testratio]
            actual_pred = list()
            for i in range(len(trained.actual)):
                actual_pred_instance = {
                    'actual': trained.actual[i],
                    'predicted': trained.predicted[i],
                    'difference': trained.difference[i]
                }
                actual_pred.append(actual_pred_instance)
            actual_vs_predicted_for_test_ratio[testratio] = actual_pred
        all_actual_vs_predicted_table[algo] = actual_vs_predicted_for_test_ratio

    return make_response(all_actual_vs_predicted_table)


if __name__ == "__main__":

    global df
    global tempdf
    global time
    global time_format
    global test_ratio
    global junction
    global algorithm
    global trained
    global auto_trained_models
    global auto_trained_for_junctions
    global trained_map
    global accuracies_map
    global master_algorithm_and_test_ratio_for_junction
    global master_data
    global master_data_table
    global all_trained_data
    global master_junctions_accuracies
    global highest_accuracy_algorithm
    global highest_accuracy_test_ratio
    global spring_url
    global show_by
    global relative_change_map
    global all_junctions_csv_data
    global start_year
    global start_year_map
    global unique_junctions_in_dataset
    global type_of_data
    global junction_district_maps
    global junction_roadway_width_maps
    global roadway_width_max_vehicles_maps
    global highest_accuracy_trained
    
    highest_accuracy_trained = None
    junction_district_maps = list()
    junction_roadway_width_maps = list()
    roadway_width_max_vehicles_maps = list()
    start_year: int = 0
    type_of_data: str = ""
    start_year_map = dict()
    show_by: str = ""
    highest_accuracy_algorithm = ""
    highest_accuracy_test_ratio = float(0)
    unique_junctions_in_dataset = list()
    spring_url = ""
    all_trained_data = dict()
    trained_map = dict()
    accuracies_map = dict()
    df = pd.DataFrame()
    tempdf = pd.DataFrame()
    master_trained_algorithm_and_test_ratio_for_junction = tuple()
    master_data = dict()
    master_data_table = dict()
    master_junctions_accuracies = dict()
    relative_change_map = dict()
    all_junctions_csv_data = dict()

    if len(sys.argv) == 1 or sys.argv[1] == 'DEV':
        spring_url = config.spring_dev_url
        app.run()
    elif sys.argv[1] == 'PROD':
        # will work only after spring deployment is done
        spring_url = config.spring_prod_url
        app.run(debug=True, host='0.0.0.0')
    else:
        raise exceptions.BadRequest("Bad request")
