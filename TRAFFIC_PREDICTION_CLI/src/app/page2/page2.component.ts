import { Component, OnInit } from '@angular/core';
import { PropService } from '../services/propService/prop.service';
import { OperationService } from '../services/operationService/operation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlaskService } from '../services/flaskService/flask.service';
import { Chart } from 'chart.js/auto';
import { ngxCsv } from 'ngx-csv';
import { Router } from '@angular/router';




@Component({
	selector: 'app-page2',
	templateUrl: './page2.component.html',
	styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnInit {
	constructor(
		private router: Router,
		private propService: PropService,
		private operationService: OperationService,
		private _snackBar: MatSnackBar,
		private flaskService: FlaskService,
	) {}

	recievedPlotData: object = {}  // Object containing vehicles vs datetime information of all junctions
	vehicles = []  // Vehicles array to display on y axis of chart
	datetime = []  // DateTime array to display on x axis of chart
	actual = []  // Actual values array for plotting on chart for comparison
	predicted = []  // Predicted values array for plotting on chart for comparison
	labels = []  // Index (prediction number) array for plotting

	errorstring: string = "" // error message to be displayed on the screen

	dataVisualizationType: string = "Table"
	dataVisualizationJunctionName: string = "Junction 1"
	junctionToBePlotted: string = "Junction 1"
	futurePredictionsRepresentationType: string = "Table"
	comparisonDataRepresentationType: string = "Table"
	inputJunction: string = "Choose Junction"// input variables for junction and months
	inputTime: string = ""
	inputAlgorithm: string = "Random Forest Regression"
	time: string = "Days"
	modelSummary: string[] = [] 
	keys: any
	obj = {} // object to be passed to the back-end that comprises of junction and months


	accuracyScore: any  // accuracy on test data

	index: number = 0  // holds paginator index
	numberOfRecords: number = 0  // total number of records in table for displaying in paginator
	indexResult: number = 0 // hold paginator index for result table
	numberOfRecordsResult: number = 0 // total number of records in result table for displaying in paginator
	predictedTableIndex: number = 0  // holds paginator index for predicted values table
	numberOfRecordsPredicted: number = 0  // total number of records in table for displaying in paginator
	predictedChartIndex: number = 0  // holds paginator index for comparison chart
	numberOfPlotDataEntries: number = 0  // holds number of predictions for showing in paginator or comparison chart

	toggleDataVisualizationTable: boolean = true
	toggleDataVisualizationChartHidden: boolean = true
	toggleFuturePredictionsTable: boolean = true
	toggleFuturePredictionsPlotHidden: boolean = true
	toggleComparisonTable: boolean = true
	toggleComparisonChartHidden: boolean = true
	toggleErrorString: boolean = false; // for displaying if validations are not correct
	startedTraining: boolean = false;// for loading symbol when training starts
	resultTableReady: boolean = false  // if true then renders the result table
	predictedTableReady: boolean = false  // if true then renders the predicted values table
	futurePredictionsReadyHidden: boolean = true
	gotAccuracy: boolean = false  // if true then renders accuracy
	futurePredictionsChartHidden: boolean = true // to show the prediction image when training ends 
	vehiclesVsDateTimeChartHidden: boolean = true  // if true then renders the vehicles vs datetime plot for given junction
	comparisonChartHidden: boolean = true // if true then renders the comparison chart

	classForPreviousButton: string = "page-item disabled"  // class for previous button in paginator
	classForNextButton: string = "page-item"  // class for next button in paginator
	classForPreviousButtonResult: string = "page-item disabled" // class for previous button in paginator of result table
	classForNextButtonResult: string = "page-item" // class for next button in paginator of result table
	classForPreviousButtonPlot: string = "page-item disabled"  // class for previous button in paginator of predicted values comparison plot
	classForNextButtonPlot = "page-item" // class for previous button in paginator of predicted values comparison plot
	classForPreviousButtonPredicted: string = "page-item disabled"  // class for previous button in paginator of predicted values table
	classForNextButtonPredicted: string = "page-item"  // class for next button in paginator of predicted values table

	displayedColumns: string[] = []  // array that holds all column values that will be shown in mat-table
	displayedColumnsResult: string[] = []  // array that holds all column values that will be shown in result mat-table
	displayedColumnsPredicted: string[] = ['Actual', 'Predicted']  // only two columns for predicted values table

	dataSource: any  // holds data for rendering row values in table
	dataSourceResult: any  // holds data for rendering row values in result table
	dataSourcePredicted: any  // holds data for rendering row values in predicted values table

	tableResult: object = {}  // holds all result table data
	tablePredicted: object = {}  // holds all predicted values table data
	predictionPlotData: object = {}  // holds data for comparison chart

	myChart: any  // ngModel variable of canvas 'myChart'
	plot: any  // ngModel variable of canvas 'plot' (result values)
	predictedChart: any  // ngModel variable of canvas 'predictedChart' (comparison between actual and predicted values)

	x: any
	testRatio: number = 0

	ngOnInit(): void {


		this.testRatio = this.propService.testRatio

		// On Init, render table representing csv data from csv file read as input in home page
		// The csv data is stored in 'this.propservice.data' variable

		this.displayedColumns = ['DateTime', 'Junction', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];
		this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)
		this.numberOfRecords = Object.values(this.propService.data).length

		// get all plot data i.e. vehicles vs datetime information of all junctions
		this.flaskService.getPlot().subscribe({
			next: (response) => {
					this.recievedPlotData = response
					this.junctionToBePlotted = "Junction 1"
					this.show1()
				},
			error: (error: HttpErrorResponse) => { console.log(error.message) }
		})

		// if index of paginator is not 0 then enable previous button
		// because if zero then no use of previous button
		if (this.index !== 0) { this.classForPreviousButton = "page-item" }
		

	}


	changeDataVisualizationType() {
		if (this.dataVisualizationType == "Table") {
			this.vehiclesVsDateTimeChartHidden = true
			this.toggleDataVisualizationChartHidden = true
			this.toggleDataVisualizationTable = true
		} else {
			this.toggleDataVisualizationChartHidden = false
			this.toggleDataVisualizationTable = false
			this.changeJunctionToBePlotted()
		}
	}


	changeFuturePredictionsRepresentationType() {
		if (this.futurePredictionsRepresentationType == "Table") {
			this.futurePredictionsChartHidden = true
			this.toggleFuturePredictionsTable = true
			this.toggleFuturePredictionsPlotHidden = true
		} else {
			this.futurePredictionsChartHidden = false
			this.toggleFuturePredictionsPlotHidden = false
			this.toggleFuturePredictionsTable = false
		}
	}




	changeComparisonDataRepresentationType() {
		if (this.comparisonDataRepresentationType == "Table") {
			this.toggleComparisonTable = true
			this.toggleComparisonChartHidden = true
			this.comparisonChartHidden = true
		} else {
			this.toggleComparisonTable = false
			this.toggleComparisonChartHidden = false
			this.comparisonChartHidden = false
		}
	}
	



	changeJunctionToBePlotted() {
		if (this.junctionToBePlotted == "Junction 1") {
			this.show1()
		}
		if (this.junctionToBePlotted == "Junction 2") {
			this.show2()
		}
		if (this.junctionToBePlotted == "Junction 3") {
			this.show3()
		}
		if (this.junctionToBePlotted == "Junction 4") {
			this.show4()
		}
	}





	checkPredictions() {
		if (!this.resultTableReady) {
			this.errorstring = "Warning: Training not done"
			this.toggleErrorString = true
		}
	}





	LineChart(x: any, y: any) {
		this.plot = new Chart("plot", {
			type: 'line',
			data: {
				labels: x,
				datasets: [{
					label: '# of Vehicles',
					data: y,
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Vehicles'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Date-Time'
						}
					}
				}
			}
		});
	}
	

	

	plotFuturePredictions(x: any, y: any) {
		// prediction is done
		this.futurePredictionsChartHidden = false

		// plot chart (canvas) to show results
		// destroy chart if already in use
		if (this.myChart != null) { this.myChart.destroy() }
		this.myChart = new Chart("myChart", {
			type: 'line',
			data: {
				labels: x,
				datasets: [{
					label: '# of Vehicles',
					data: y,
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Vehicles'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Date-Time'
						}
					}
				}
			}
		});
	}




	// show Line-Chart for junction 1
	show1() {
		this.vehiclesVsDateTimeChartHidden = false
		this.datetime = Object.values(this.recievedPlotData)[0]['datetime']  // 0 index means junction 1
		this.vehicles = Object.values(this.recievedPlotData)[0]['vehicles']

		// if chart (canvas) is already in use then destroy it
		if (this.plot != null) {
			this.plot.destroy()
		}

		// then show the chart
		this.LineChart(this.datetime, this.vehicles)
	}


	// show Line-Chart for junction 2
	show2() {
		this.vehiclesVsDateTimeChartHidden = false
		this.datetime = Object.values(this.recievedPlotData)[1]['datetime']  // 1 index means junction 2
		this.vehicles = Object.values(this.recievedPlotData)[1]['vehicles']


		// if chart (canvas) is already in use then destroy it
		if (this.plot != null) {
			this.plot.destroy()
		}

		// then show the chart
		this.LineChart(this.datetime, this.vehicles)
	}


	// show Line-Chart for junction 3
	show3() {
		this.vehiclesVsDateTimeChartHidden = false
		this.datetime = Object.values(this.recievedPlotData)[2]['datetime']  // 2 index means junction 3
		this.vehicles = Object.values(this.recievedPlotData)[2]['vehicles']

		// if chart (canvas) is already in use then destroy it
		if (this.plot != null) {
			this.plot.destroy()
		}

		// then show the chart
		this.LineChart(this.datetime, this.vehicles)
	}


	// show Line-Chart for junction 4
	show4() {
		this.vehiclesVsDateTimeChartHidden = false
		this.datetime = Object.values(this.recievedPlotData)[3]['datetime']  // 3 index means junction4
		this.vehicles = Object.values(this.recievedPlotData)[3]['vehicles']

		// if chart (canvas) is already in use then destroy it
		if (this.plot != null) {
			this.plot.destroy()
		}

		// then show the chart
		this.LineChart(this.datetime, this.vehicles)
	}


	// on clicking next button in paginator
	next() {

		// if next button in paginator is active (not disabled)
		if (this.classForNextButton !== "page-item disabled") {

			// go ahead 5 indices (meaning show next 5 table records accessing those indices)
			this.index = this.index + 5

			// set next 5 row values from CSV data (this.propService.data) to the dataSource variable
			// so that it can be shown in table
			this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)

			// if index is pointing to last 5 records from the csv data then disable next button in paginator
			if (this.index === Object.values(this.propService.data).length - 5) {
				this.classForNextButton = "page-item disabled"
			}
		}

		// if index is not 0 (means we have some previous records to show)
		// then enable previous button in paginator
		if (this.index != 0) {
			this.classForPreviousButton = "page-item"
		}
	}


	// on clicking previous button in paginator
	previous() {

		// if previous button in paginator is active (not disabled)
		if (this.classForPreviousButton !== "page-item disabled") {

			// go back 5 indices (meaning show previous 5 table records accessing those indices)
			this.index = this.index - 5

			// set next 5 row values from CSV data (this.propService.data) to the dataSource variable 
			// so that it can be shown in table
			this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)

			// if index is 0 then previous button is of no use in paginator
			// hence disable it
			if (this.index === 0) {
				this.classForPreviousButton = "page-item disabled"
			}

			// if index is not 0 then it must be greater than or equal to 5
			// means we have previous indices and records to show
			// hence keep previous button enabled
			else {
				this.classForPreviousButton = "page-item"
			}
		}
	}


	// on clicking next button in paginator of result table
	nextResult() {

		// if next button in paginator is active (not disabled)
		if (this.classForNextButtonResult !== "page-item disabled") {

			// go ahead 10 indices (meaning show next 10 table records accessing those indices)
			this.indexResult = this.indexResult + 10

			// set next 10 row values from result table data (this.tableResult) to the dataSource variable
			// so that it can be shown in table
			this.dataSourceResult = Object.values(this.tableResult).slice(this.indexResult, this.indexResult + 10)

			// if index is pointing to last 10 records from the csv data then disable next button in paginator
			if (this.indexResult === Object.values(this.tableResult).length - 10) {
				this.classForNextButtonResult = "page-item disabled"
			}
		}

		// if index is not 0 (means we have some previous records to show)
		// then enable previous button in paginator
		if (this.indexResult != 0) {
			this.classForPreviousButtonResult = "page-item"
		}
	}


	// on clicking previous button in paginator of result table
	previousResult() {

		// if previous button in paginator is active (not disabled)
		if (this.classForPreviousButtonResult !== "page-item disabled") {

			// go back 10 indices (meaning show previous 10 table records accessing those indices)
			this.indexResult = this.indexResult - 10

			// set next 10 row values from result table data (this.tableResult) to the dataSource variable 
			// so that it can be shown in table
			this.dataSourceResult = Object.values(this.tableResult).slice(this.indexResult, this.indexResult + 10)

			// if index is 0 then previous button is of no use in paginator
			// hence disable it
			if (this.indexResult === 0) {
				this.classForPreviousButtonResult = "page-item disabled"
			}

			// if index is not 0 then it must be greater than or equal to 10
			// means we have previous indices and records to show
			// hence keep previous button enabled
			else {
				this.classForPreviousButtonResult = "page-item"
			}
		}
	}


	// on clicking next button in paginator of comparison table
	nextPredicted() {

		// if next button in paginator is active (not disabled)
		if (this.classForNextButtonPredicted !== "page-item disabled") {

			// go ahead 5 indices (meaning show next 5 table records accessing those indices)
			this.predictedTableIndex = this.predictedTableIndex + 5

			// set next 5 row values from comparison table data (this.tablePredicted) to the dataSource variable
			// so that it can be shown in table
			this.dataSourcePredicted = Object.values(this.tablePredicted).slice(this.predictedTableIndex, this.predictedTableIndex + 5)

			// if index is pointing to last 5 records from the csv data then disable next button in paginator
			if (this.predictedTableIndex === Object.values(this.tablePredicted).length - 5) {
				this.classForNextButtonPredicted = "page-item disabled"
			}
		}


		// if index is not 0 (means we have some previous records to show)
		// then enable previous button in paginator
		if (this.predictedTableIndex != 0) {
			this.classForPreviousButtonPredicted = "page-item"
		}
	}


	// on clicking previous button in paginator of comparison table
	previousPredicted() {

		// if previous button in paginator is active (not disabled)
		if (this.classForPreviousButtonPredicted !== "page-item disabled") {

			// go back 5 indices (meaning show previous 5 table records accessing those indices)
			this.predictedTableIndex = this.predictedTableIndex - 5

			// set next 5 row values from comparison table data (this.tablePredicted) to the dataSource variable 
			// so that it can be shown in table
			this.dataSourcePredicted = Object.values(this.tablePredicted).slice(this.predictedTableIndex, this.predictedTableIndex + 5)

			// if index is 0 then previous button is of no use in paginator
			// hence disable it
			if (this.predictedTableIndex === 0) {
				this.classForPreviousButtonPredicted = "page-item disabled"
			}

			// if index is not 0 then it must be greater than or equal to 5
			// means we have previous indices and records to show
			// hence keep previous button enabled
			else {
				this.classForPreviousButtonPredicted = "page-item"
			}
		}
	}


	// on clicking next button in paginator of comparison plot
	next10Plot() {

		// if next button in paginator is active (not disabled)
		if (this.classForNextButtonPlot !== "page-item disabled") {

			// go ahead 10 indices (meaning show next 5 predictions accessing those indices)
			this.predictedChartIndex = this.predictedChartIndex + 10

			// set plot variables to get actual, predicted and labels of next 10 predictions from predictionPlotData
			this.actual = Object.values(this.predictionPlotData)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.predicted = Object.values(this.predictionPlotData)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.labels = Object.values(this.predictionPlotData)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)

			// plot comparison chart of these indices 
			this.compareChart(this.labels, this.actual, this.predicted)

			// if index is pointing to last 5 records from the plot data then disable next button in paginator
			if (this.predictedChartIndex === Object.values(this.predictionPlotData).length - 10) {
				this.classForNextButtonPlot = "page-item disabled"
			}
		}

		// if there are predictions to show or index is not 0 then enable the previous button
		if (this.predictedChartIndex != 0) {
			this.classForPreviousButtonPlot = "page-item"
		}
	}


	// on clicking previous button in paginator of comparison plot
	previous10Plot() {

		// if previous button in paginator is enabled (not disabled)
		if (this.classForPreviousButtonPlot !== "page-item disabled") {

			// go back 10 indices (meaning show previous 5 predictions accessing those indices)
			this.predictedChartIndex = this.predictedChartIndex - 10

			// set plot variables to get actual, predicted and labels of next 10 predictions
			this.actual = Object.values(this.predictionPlotData)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.predicted = Object.values(this.predictionPlotData)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.labels = Object.values(this.predictionPlotData)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)


			// plot comparison chart
			this.compareChart(this.labels, this.actual, this.predicted)

			// if index is 0 then previous button is of no use in paginator
			// hence disable it
			if (this.predictedChartIndex === 0) {
				this.classForPreviousButtonPlot = "page-item disabled"
			}

			// if index is not 0 then it must be greater than or equal to 10
			// means we have previous indices and records to show
			// hence keep previous button enabled
			else {
				this.classForPreviousButtonPlot = "page-item"
			}
		}
	}


	// function to plot comparison line chart
	compareChart(labels: number[], actual: number[], predicted: number[]) {

		// if comparison chart (canvas) is in use then destroy it
		if (this.predictedChart != null) { this.predictedChart.destroy() }
		this.predictedChart = new Chart("predictedChart", {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: "actual",
						backgroundColor: "white",
						borderWidth: 1,
						borderColor: "#900",
						fill: false,
						data: actual
					},
					{
						label: "predicted",
						backgroundColor: "white",
						borderWidth: 1,
						borderColor: "#090",
						fill: false,
						data: predicted
					}
				]
			},
			options: {
				maintainAspectRatio: true,
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Vehicles'
						}
					},
					x: {
						title: {
							display: true,
							text: 'values'
						}
					}
				}
			}
		});
	}


	// if new input is given then this function fires to switch off the predicted image 
	disablePredictionImage() {
		this.futurePredictionsChartHidden = true
	}

	// on clicking export to csv button option, download the data into a csv file
	exportToCsv() {
		const options = {
			fieldSeparator: ',',
			quoteStrings: '',
			decimalseparator: '.',
			showLabels: true,
			useBom: true,
			noDownload: false,
			headers: ['DateTime', 'Day', 'Hour', 'Junction', 'Month', 'Vehicles', 'Year']
		};
		try {
			new ngxCsv(this.tableResult, "result", options);
		} catch (error) {
			alert(error)
		}
	}



	// navigate to home
	navigateHome() {
		this.router.navigate(['/']);
	}




	// on click predict button
	start() {

		// check whether the fields have no value
		if (this.inputJunction !== "Choose Junction" && this.inputTime !== "") {

			// set the object to be sent to back-end
			this.propService.obj = { 
				junction: this.inputJunction, 
				time: this.inputTime,
				timeFormat: this.time,
				algorithm: this.inputAlgorithm
			}

			// no errors in validation
			// hence don't show error alert
			this.toggleErrorString = false

			// set startedTraining to true to show spinner till training and processing has completed
			this.startedTraining = true;













			this.flaskService.sendInput(this.propService.obj).subscribe({
				next: (response) => {

					// send input junction and months to the backend via function call in flask service
					this.flaskService.predict().subscribe({
						next: (response) => {

							// training has completed, disable spinner and show results
							this.startedTraining = false;


							// set datetime and vehicles variables to values recieved from backend as response
							// for table
							this.datetime = Object.values(response)[0]['datetime']
							this.vehicles = Object.values(response)[0]['vehicles']

							this.flaskService.getModelSummary().subscribe({
								next: (response) => {
									this.modelSummary = Object.values(response)
								},
								error: (error: HttpErrorResponse) => {
									console.log(error)
									alert(error.message)
								}
							})



							// get all the result data (predicted for next number of days provided)
							this.flaskService.getResultTable().subscribe({
								next: (response) => {

									// to show result table
									this.resultTableReady = true
									this.futurePredictionsReadyHidden = false

									// set tableResult variable to response so that it can be used later
									this.tableResult = response

									// display only these columns
									this.displayedColumnsResult = ['DateTime', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];

									// get all row values from the response recieved to show in table
									this.dataSourceResult = Object.values(response).slice(this.index, this.index + 10)

									// get total number of records from table data
									this.numberOfRecordsResult = Object.values(response).length

									this.plotFuturePredictions(this.datetime, this.vehicles)
								},
								error: (error: HttpErrorResponse) => {
									console.log(error)
									alert(error.message)
								}
							})



							// get accuracy of the junction from the backend
							this.flaskService.getAccuracy().subscribe({
								next: (response) => {

									// switch to display accuracy on the UI
									this.gotAccuracy = true

									// get accuracy in a variable
									this.accuracyScore = Object.values(response)
								},
								error: (error: HttpErrorResponse) => {
									console.log(error)
									alert(error.message)
								}
							})



							// get comparison data (actual vs predicted) from backend
							this.flaskService.getActualPredicted().subscribe({
								next: (response) => {

									// switch to display comparison table
									this.predictedTableReady = true

									// get data in a variable
									this.tablePredicted = response

									// get the row data from table data recieved as response
									this.dataSourcePredicted = Object.values(response).slice(this.predictedTableIndex, this.predictedTableIndex + 5)

									// get total number of records
									this.numberOfRecordsPredicted = Object.values(response).length
								},
								error: (error: HttpErrorResponse) => {
									console.log(error)
									alert(error.message)
								}
							})




							// get comparison data (actual vs predicted for plotting) from backend
							this.flaskService.getActualPredictedForPlot().subscribe({
								next: (response) => {

									this.comparisonChartHidden = false
									// set it to the variable 
									this.predictionPlotData = response

									// differentiate plot data into actual, predicted and indices
									this.actual = Object.values(response)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
									this.predicted = Object.values(response)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
									this.labels = Object.values(response)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)

									// get total number of records
									this.numberOfPlotDataEntries = Object.values(response)[0]['actual'].length

									// destroy comparison chart if already in use
									if (this.predictedChart != null) { this.predictedChart.destroy() }

									// then plot comparison chart
									this.predictedChart = new Chart("predictedChart", {
										type: 'line',
										data: {
											labels: this.labels,
											datasets: [
												{
													label: "actual",
													backgroundColor: "white",
													borderWidth: 1,
													borderColor: "#900",
													fill: false,
													data: this.actual
												},
												{
													label: "predicted",
													backgroundColor: "white",
													borderWidth: 1,
													borderColor: "#090",
													fill: false,
													data: this.predicted
												}
											]
										},
										options: {
											maintainAspectRatio: true,
											scales: {
												y: {
													beginAtZero: true,
													title: {
														display: true,
														text: 'Vehicles'
													}
												},
												x: {
													title: {
														display: true,
														text: 'DateTime'
													}
												}
											}
										}
									});
								},
								error: (error: HttpErrorResponse) => {
									console.log(error)
									alert(error.message)
								}
							})



							
						},
						error: (error: HttpErrorResponse) => {
							console.log(error)
							alert(error.message)
						}
					})
				},
				error: (error: HttpErrorResponse) => {
					console.log(error)
					alert(error.message)
				}
			})
		}

		// if error in validation
		else {
			this.errorstring = "Note: All fields are required"
			this.toggleErrorString = true
			this._snackBar.open("Note: All fields are required", '\u2716')
		}
	}
}
