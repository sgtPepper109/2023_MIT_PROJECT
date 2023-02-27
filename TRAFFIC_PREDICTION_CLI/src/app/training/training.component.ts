import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Operation } from '../services/operationService/operation'
import { OperationService } from '../services/operationService/operation.service';
import { PropService } from '../services/propService/prop.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { FlaskService } from '../services/flaskService/flask.service';
import { Chart } from 'chart.js/auto';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-training',
	templateUrl: './training.component.html',
	styleUrls: ['./training.component.css']
})

export class TrainingComponent implements OnInit {
	constructor(
		private router: Router,
		private operationService: OperationService,
		private propService: PropService,
		private _snackBar: MatSnackBar,
		private ngxCsvParser: NgxCsvParser,
		private flaskService: FlaskService,
		private _formBuilder: FormBuilder
	) {}



	public operations: Operation[] = []
	isLinear: boolean = false
	gotAccuracies: boolean = false


	accuracyBarChartHidden: boolean = true
	toggleAccuracyBarChart: boolean = false

	junctionChoice: string = ""
	maxVehicles: number = 0
	accuracies: any
	csvRecords: object = {}
	header: boolean = true
	fileName: string = ""
	datasetPath: string = ""
	recievedPlotData: object = {}  // Object containing vehicles vs datetime information of all junctions
	vehicles: Array<number> = []  // Vehicles array to display on y axis of chart
	datetime = []  // DateTime array to display on x axis of chart
	inputJunction: string = ""// input variables for junction and months
	inputTime: string = ""
	inputAlgorithm: string = "Random Forest Regression"
	time: string = "Days"
	modelSummary: Array<string> = [] 
	keys: any
	comparisonDataRepresentationType: string = "Table"
	predictedChartIndex: number = 0  // holds paginator index for comparison chart
	toggleComparisonTable: boolean = true
    predictedTableReady: boolean = false  // if true then renders the predicted values table
	toggleComparisonChartHidden: boolean = true
	comparisonChartHidden: boolean = true // if true then renders the comparison chart
	numberOfPlotDataEntries: number = 0  // holds number of predictions for showing in paginator or comparison chart
	classForPreviousButtonPlot: string = "page-item disabled"  // class for previous button in paginator of predicted values comparison plot
	classForNextButtonPlot = "page-item" // class for previous button in paginator of predicted values comparison plot
	classForPreviousButtonPredicted: string = "page-item disabled"  // class for previous button in paginator of predicted values table
	classForNextButtonPredicted: string = "page-item"  // class for next button in paginator of predicted values table
	obj = {} // object to be passed to the back-end that comprises of junction and months
	autoTrained = true

	myChart: any  // ngModel variable of canvas 'myChart'
	plot: any  // ngModel variable of canvas 'plot' (result values)
	x: any
	testRatio: number = 0
	dataSourcePredicted: any  // holds data for rendering row values in predicted values table
	predictionPlotData: object = {}  // holds data for comparison chart
	predictedChart: any  // ngModel variable of canvas 'predictedChart' (comparison between actual and predicted values)

	index: number = 0  // holds paginator index
	numberOfRecords: number = 0  // total number of records in table for displaying in paginator
	predictedTableIndex: number = 0  // holds paginator index for predicted values table
	numberOfRecordsPredicted: number = 0  // total number of records in table for displaying in paginator

	displayedColumns: Array<string> = []  // array that holds all column values that will be shown in mat-table
	dataSource: any  // holds data for rendering row values in table

	// declaring all the input field variables with help of ngModel
	dataset: string = ""
	inputTrainRatio: string = ""
	inputTestRatio: string = ""
	dataVisualizationType: string = "Table"
	dataVisualizationJunctionName: string = "Junction 1"
	junctionToBePlotted: string = "Junction 1"

	classForPreviousButton: string = "page-item disabled"  // class for previous button in paginator
	classForNextButton: string = "page-item"  // class for next button in paginator

	// error message to be displayed on the screen
	errorstring: string = ""
	accuracyBarChart: any  // ngModel variable of canvas 'accuracyBarChart'

	// for displaying if validations are not correct
	toggleErrorString: boolean = false
	csvDataParsed: boolean = false
	trainingHidden: boolean = false
	toggleDataVisualizationTable: boolean = true
	toggleDataVisualizationChartHidden: boolean = true
	toggleFuturePredictionsTable: boolean = true
	toggleFuturePredictionsPlotHidden: boolean = true
	futurePredictionsChartHidden: boolean = true // to show the prediction image when training ends 
	futurePredictionsReadyHidden: boolean = true
	actual: Array<number> = []  // Actual values array for plotting on chart for comparison
	predicted: Array<number> = []  // Predicted values array for plotting on chart for comparison
	tablePredicted: object = {}  // holds all predicted values table data
	labels = []  // Index (prediction number) array for plotting
	maxLimitArray: number[] = []
	junctions: string[] = []



	startedTraining: boolean = false;// for loading symbol when training starts
	vehiclesVsDateTimeChartHidden: boolean = true  // if true then renders the vehicles vs datetime plot for given junction

	ngOnInit() { 
		/* TODO document why this method 'ngOnInit' is empty */
		this.flaskService.getAllJunctions().subscribe({
			next: (response) => {
				this.junctions = Object.values(response)
				this.propService.junctions = this.junctions
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})
	}

	changeTrain() {
		if (parseFloat(this.inputTestRatio) < 0) {
			this.errorstring = "Note: ratio cannot be a negative value"
			this.toggleErrorString = true
			this.inputTestRatio = "0"
		} else {
			this.toggleErrorString = false
			this.inputTrainRatio = (1 - parseFloat(this.inputTestRatio)).toString()
		}
	}

	fileChangeListener($event: any): void {
		
		const files = $event.srcElement.files;
		this.fileName = files[0]['name']
		this.header = (this.header as unknown as string) === 'true' || this.header === true;

		const arr = this.fileName.split('.')
		if (arr[arr.length - 1] === 'csv' || arr[arr.length - 1] === 'data' || arr[arr.length - 1] === 'xlsx') {

		this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',', encoding: 'utf8' })
			.pipe().subscribe({
				next: (result): void => {
					this.csvRecords = Object.values(result);

					this.flaskService.sendCsvData(result).subscribe()
				},
				error: (error: NgxCSVParserError): void => {
					console.log('Error', error);
				}
			});
		} else {
			this.errorstring = "Note: Incorrect file type (Please choose a .csv, or a .xlsx or a .data file"
			this.toggleErrorString = true
			this._snackBar.open("Note: Incorrect file type (Please choose a .csv, or a .xlsx or a .data file", 'x') 
		}
	}


	reset() {
		this.inputTrainRatio = ""
		this.inputTestRatio = ""
		this.dataset = ""
		this.csvRecords = {}
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


	changeJunctionToBePlotted() {
		let junctionIndex = parseInt(this.junctionChoice) -1
		this.show(junctionIndex)
	}

	show(param1: number) {
		this.vehiclesVsDateTimeChartHidden = false; 
		this.datetime = Object.values(this.recievedPlotData)[param1]['datetime']  // 0 index means junction 1
		this.vehicles = Object.values(this.recievedPlotData)[param1]['vehicles']

		this.maxVehicles = Math.max(...this.vehicles)
		this.propService.maxVehicles = this.maxVehicles

		// if chart (canvas) is already in use then destroy it
		if (this.plot != null) {
			this.plot.destroy()
		}

		// then show the chart
		this.maxLimitArray = []
		for (let i = 0; i < this.datetime.length; i++) {
			this.maxLimitArray.push(this.maxVehicles)
		}
		this.LineChart(this.datetime, this.vehicles)
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




	LineChart(x: any, y: any) {
		this.plot = new Chart("plot", {
			type: 'line',
			data: {
				labels: x,
				datasets: [
					{
						label: '# of Vehicles',
						data: y,
						borderWidth: 1,
						fill: false
					},
					{
						label: 'Max point',
						data: this.maxLimitArray,
						borderWidth: 1,
						borderColor: '#900',
						fill: false
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
	}



	navigateToAdminInputs() {
		this.router.navigate(['/junctionProperties'])
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

	// navigate to page2
	navigateToPage2() {
		this.router.navigate(['/prediction'])
	}


	manageInfo() {
		this.dataset = this.propService.dataset

		if (this.inputTestRatio !== "" && this.inputTrainRatio !== "") {
			const trainRatio = parseFloat(this.inputTrainRatio)
			const testRatio = parseFloat(this.inputTestRatio)

			if (trainRatio + testRatio === 1.0 && testRatio < 1) {
				let operation: Operation = {
					dataset: this.dataset,
					trainRatio: trainRatio,
					testRatio: testRatio,
					userId: 1234567890
				}



				this.operationService.addOperation(operation).subscribe({
					next: (response: Operation) => {

						this.flaskService.setData().subscribe({
							next: (response) => {

								this.flaskService.getTableData().subscribe({
									next: (response) => {

										// this is a service file shared with page2 component
										this.propService.data = response
										this.propService.trainRatio = trainRatio
										this.propService.dataset = this.dataset
										this.propService.testRatio = testRatio
			
										this.trainingHidden = false
										this.csvDataParsed= true

										this.testRatio = this.propService.testRatio

										// On Init, render table representing csv data from csv file read as input in training page
										// The csv data is stored in 'this.propservice.data' variable

										this.displayedColumns = ['DateTime', 'Junction', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];
										this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)
										this.numberOfRecords = Object.values(this.propService.data).length

										// get all plot data i.e. vehicles vs datetime information of all junctions
										this.flaskService.getPlot().subscribe({
											next: (response) => {
													this.recievedPlotData = response
													this.junctionChoice = "1"
													this.changeJunctionToBePlotted()
												},
											error: (error: HttpErrorResponse) => { console.log(error.message) }
										})

										// if index of paginator is not 0 then enable previous button
										// because if zero then no use of previous button
										if (this.index !== 0) { this.classForPreviousButton = "page-item" }

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

			} else {
				this.errorstring = "Note: Invalid input ratios (Must be in range of 0 to 1"
				this.toggleErrorString = true
				this._snackBar.open("Note: Invalid input ratios (Must be in range of 0 to 1", '\u2716')
			}
		} else {
			this.errorstring = "Note: All fields are required"
			this.toggleErrorString = true
			this._snackBar.open("Note: All fields are required", '\u2716')
		}
	}



	navigateToPredictions() {
		this.router.navigate(['/prediction'])
	}

	barChart(param1: Array<string>, param2: Array<number>) {
		this.accuracyBarChart = new Chart("accuracyBarChart", {
			type: 'bar',
			data: {
				labels: param1,
				datasets: [
					{
						label: "Algorithms",
						data: param2
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
							text: 'Junctions'
						}
					}
				}
			}
		});
	}
	

	start() {


		// check whether the fields have no value
		if (this.inputJunction !== "" && this.inputTime !== "") {

			this.propService.inputJunction = this.inputJunction
			this.propService.inputTime = this.inputTime
			this.propService.time = this.time
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

							this.autoTrained = false
							this.propService.autoTrained = false

							// set datetime and vehicles variables to values recieved from backend as response
							// for table
							this.propService.predictionPlotData = Object.values(response)
							

							this.flaskService.getModelSummary().subscribe({
								next: (response) => {
									this.futurePredictionsReadyHidden = false
									this.modelSummary = Object.values(response)




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





									this.flaskService.getAccuracies().subscribe({
										next: (response) => {
											this.gotAccuracies = true
											this.accuracies = Object.values(response)
											this.accuracyBarChartHidden = false
											
											let algorithms: Array<string> = []
											let accuracyScores: Array<number> = []
											for (let i of this.accuracies) {
												algorithms.push(i.model)
												accuracyScores.push(i.accuracyscore)
											}
											this.barChart(algorithms, accuracyScores)
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

