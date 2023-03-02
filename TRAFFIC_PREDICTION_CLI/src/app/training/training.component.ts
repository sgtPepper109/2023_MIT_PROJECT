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
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';
import { JunctionSpecificsService } from '../services/junctionSpecifics/junction-specifics.service';
import { JunctionDistrictMap } from '../services/junctionDistrictMap/junction-district-map';
import { JunctionRoadwayWidthMap } from '../services/junctionRoadwayWidth/junction-roadway-width-map';
import { RoadwayWidthMaxVehiclesMap } from '../services/roadwayWidth-maxVehicles-map/roadwayWidth-maxVehicles-map';

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
		private _formBuilder: FormBuilder,
		private junctionSpecificsService: JunctionSpecificsService,
	) {}

	predictionsOption: string = 'Line Plot'
	junctionDistrictMaps: Map<string, string> = new Map()
	junctionRoadwayWidthMaps: Map<string, string> = new Map()
	roadwayWidthMaxVehiclesMaps: Map<number, number> = new Map()
	classForNextButtonResult: string = ""
	tableResult: any
	classForPreviousButtonResult: string = ""
	allJunctionsPredictedData: any
	allJunctionsPlotData: any
    plotDataReady: boolean = false
	duration: number = 0
	existingDataOption: string = 'Line Plot'
	comparisonOption: string = 'Line Plot'
	accuracyOption: string = 'Line Plot'
	predictionReady: boolean = false
	public operations: Operation[] = []
	isLinear: boolean = false
	gotAccuracies: boolean = false

	accuracyBarChartHidden: boolean = true
	toggleAccuracyBarChart: boolean = false

	startProcess: boolean = false
	junctionChoice: string = ""
	maxVehicles: number = 0
	accuracies: any
	csvRecords: object = {}
	header: boolean = true
	fileName: string = ""
	datasetPath: string = ""
	recievedPlotData: any
	vehicles: Array<any> = []  // Vehicles array to display on y axis of chart
	datetime: Array<any> = [] // DateTime array to display on x axis of chart
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
	trainRatio: number = 0
	dataSourcePredicted: any  // holds data for rendering row values in predicted values table
	predictionPlotData: object = {}  // holds data for comparison chart
	predictedChart: any  // ngModel variable of canvas 'predictedChart' (comparison between actual and predicted values)

	index: number = 0  // holds paginator index
	numberOfRecords: number = 0  // total number of records in table for displaying in paginator
	predictedTableIndex: number = 0  // holds paginator index for predicted values table
	numberOfRecordsPredicted: number = 0  // total number of records in table for displaying in paginator
	csvData: Array<any> = []

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
	currentJunctionsPredictedData: any
	currentJunctionPlotData: any
	resultTableReady: boolean = false
	displayedColumnsResult: string[] = []
	dataSourceResult: any
	numberOfRecordsResult: number = 0
	indexResult: number = 0
	vehiclesToBePlotted: any
	dateTimeToBePlotted: any
	currentDistrict: any
	currentRoadwayWidth: any
	currentMaxVehicles: any
	junctionSpecificDetailsProvided: boolean = false

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

	changePredictionsOption() {
		if (this.predictionsOption == 'Line Plot') {
			this.toggleFuturePredictionsTable = true
		} else {
			this.toggleFuturePredictionsTable = false
		}
	}
	changeExistingDataOption() {
		if (this.existingDataOption == 'Line Plot') {
			this.toggleDataVisualizationTable = true
		} else {
			this.toggleDataVisualizationTable = false
		}
	}
	changeAccuracyOption() {
		if (this.accuracyOption == 'Table') {
			this.toggleAccuracyBarChart = true
		} else {
			this.toggleAccuracyBarChart = false
		}
	}
	changeComparisonOption() {
		if (this.comparisonOption == 'Line Plot') {
			this.toggleComparisonTable = true
		} else {
			this.toggleComparisonTable = false
		}
	}
	changeJunctionToBeRendered() {
		this.autoTrained  
			? this.currentJunctionsPredictedData = this.allJunctionsPredictedData[this.junctionChoice]
			: this.currentJunctionsPredictedData = this.allJunctionsPredictedData
		

		if (this.autoTrained) {
			if (this.plotDataReady) {
				this.currentJunctionPlotData = this.allJunctionsPlotData[this.junctionChoice]
			}
		} else {
			this.currentJunctionPlotData = this.allJunctionsPlotData
		}

		
		// to show result table
		this.resultTableReady = true
		this.futurePredictionsReadyHidden = false


		// display only these columns
		this.displayedColumnsResult = ['DateTime', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];

		// get all row values from the response recieved to show in table
		this.dataSourceResult = this.currentJunctionsPredictedData.slice(this.indexResult, this.indexResult + 10)

		// get total number of records from table data
		this.numberOfRecordsResult = this.currentJunctionsPredictedData.length

		
		if (this.plotDataReady) {
			this.setVehiclesAndDateTime(
				this.currentJunctionPlotData[0]['vehicles'], 
				this.currentJunctionPlotData[0]['datetime']
			)
			this.plotFuturePredictions(this.dateTimeToBePlotted, this.vehiclesToBePlotted)
		}
	}
	setVehiclesAndDateTime(param1: any, param2: any) {
		this.vehiclesToBePlotted = param1
		this.dateTimeToBePlotted = param2
	}
	plotFuturePredictions(x: any, y: any) {
		// prediction is done
		this.futurePredictionsChartHidden = false

		// for (const element of y) {
		// 	this.maxLimitArray.push(this.propService.maxVehicles)
		// }
		// for (const element of y) {
		// 	this.maxInPlotArray.push(Math.max(...y))
		// }

		// plot chart (canvas) to show results
		// destroy chart if already in use
		if (this.myChart != null) { this.myChart.destroy() }


		this.myChart = new Chart("myChart", {
			type: 'line',
			data: {
				labels: x,
				datasets: [
					{
						label: 'Vehicles Vs DateTime',
						data: y,
						borderWidth: 1,
						borderColor: '#900',
						fill: false
					},
					// {
					// 	label: 'Max Vehicles at Junction ' + this.inputJunction + ' before prediction',
					// 	data: this.maxLimitArray,
					// 	borderWidth: 1,
					// 	borderColor: '#0000FF',
					// 	fill: false
					// },
					// {
					// 	label: 'Max Value in prediction',
					// 	data: this.maxInPlotArray,
					// 	borderWidth: 1,
					// 	borderColor: '#090',
					// 	fill: false,
					// }
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
		})









	}

	fileChangeListener($event: any): void {
		console.log('hello')
		const files = $event.srcElement.files;
		let fileName = files[0]['name']
		let header: boolean = true
		header = (header as unknown as string) === 'true' || header === true;

		const arr = fileName.split('.')
		if (arr[arr.length - 1] === 'csv' || arr[arr.length - 1] === 'data' || arr[arr.length - 1] === 'xlsx') {

		this.ngxCsvParser.parse(files[0], { header: header, delimiter: ',', encoding: 'utf8' })
			.pipe().subscribe({
				next: (result): void => {
					this.flaskService.sendCsvData(result).subscribe()
					for (const element of Object.values(result)) {
						let record: Object = {
							'Junction': element['Junction'],
							'DateTime': element['DateTime'],
							'Vehicles': element['Vehicles'],
						}
						this.datetime = []
						this.datetime.push(element.DateTime)
						this.vehicles = []
						this.vehicles.push(element.Vehicle)
						this.csvData.push(record)
						this.csvDataParsed = true
						this.propService.data = this.csvData
					}
				},
				error: (error: NgxCSVParserError): void => {
					console.log('Error', error);
				}
			});
		} else {
			this.errorstring = "Note: Incorrect file type (Please choose a .csv, or a .xlsx or a .data file"
			this.toggleErrorString = true
		}
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
		this.show(this.junctionChoice)
	}

	show(param1: string) {
		this.vehiclesVsDateTimeChartHidden = false; 
		// this.datetime = Object.values(this.recievedPlotData)[param1]['datetime']  // 0 index means junction 1
		// this.vehicles = Object.values(this.recievedPlotData)[param1]['vehicles']

		console.log(this.recievedPlotData)
		this.datetime = this.recievedPlotData[param1][0]['datetime']
		this.vehicles = this.recievedPlotData[param1][0]['vehicles']

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




	// on clicking next button in paginator of result table
	nextResult() {

		// if next button in paginator is active (not disabled)
		if (this.classForNextButtonResult !== "page-item disabled") {

			// go ahead 10 indices (meaning show next 10 table records accessing those indices)
			this.indexResult = this.indexResult + 10

			// set next 10 row values from result table data (this.tableResult) to the dataSource variable
			// so that it can be shown in table
			this.dataSourceResult = this.currentJunctionsPredictedData.slice(this.indexResult, this.indexResult + 10)

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
			this.dataSourceResult = this.currentJunctionsPredictedData.slice(this.indexResult, this.indexResult + 10)

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
						fill: false,
					},
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
			this.dataSource = Object.values(this.csvData).slice(this.index, this.index + 5)

			// if index is pointing to last 5 records from the csv data then disable next button in paginator
			if (this.index === Object.values(this.csvData).length - 5) {
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
			this.dataSource = Object.values(this.csvData).slice(this.index, this.index + 5)

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










	// manageInfo() {

	// 	if (this.inputTestRatio !== "" && this.inputTrainRatio !== "") {
	// 		const trainRatio = parseFloat(this.inputTrainRatio)
	// 		const testRatio = parseFloat(this.inputTestRatio)

	// 		if (trainRatio + testRatio === 1.0 && testRatio < 1) {
	// 			let operation: Operation = {
	// 				dataset: this.dataset,
	// 				trainRatio: trainRatio,
	// 				testRatio: testRatio,
	// 				userId: 1234567890
	// 			}



	// 			this.operationService.addOperation(operation).subscribe({
	// 				next: (response: Operation) => {

	// 					this.flaskService.setData().subscribe({
	// 						next: (response) => {

	// 							this.flaskService.getTableData().subscribe({
	// 								next: (response) => {

	// 									// this is a service file shared with page2 component
	// 									this.propService.data = response
	// 									this.propService.trainRatio = trainRatio
	// 									this.propService.dataset = this.dataset
	// 									this.propService.testRatio = testRatio
			
	// 									this.trainingHidden = false
	// 									this.csvDataParsed= true

	// 									this.testRatio = this.propService.testRatio

	// 									// On Init, render table representing csv data from csv file read as input in training page
	// 									// The csv data is stored in 'this.propservice.data' variable

	// 									this.displayedColumns = ['DateTime', 'Junction', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];
	// 									this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)
	// 									this.numberOfRecords = Object.values(this.propService.data).length

	// 									// get all plot data i.e. vehicles vs datetime information of all junctions
	// 									this.flaskService.getPlot().subscribe({
	// 										next: (response) => {
	// 												this.recievedPlotData = response
	// 												this.junctionChoice = this.junctions[0]
	// 												this.changeJunctionToBePlotted()
	// 											},
	// 										error: (error: HttpErrorResponse) => { console.log(error.message) }
	// 									})

	// 									// if index of paginator is not 0 then enable previous button
	// 									// because if zero then no use of previous button
	// 									if (this.index !== 0) { this.classForPreviousButton = "page-item" }

	// 								},
	// 								error: (error: HttpErrorResponse) => {
	// 									console.log(error)
	// 									alert(error.message)
	// 								}
	// 							})
	// 						},
	// 						error: (error: HttpErrorResponse) => {
	// 							console.log(error)
	// 							alert(error.message)
	// 						}
	// 					})
	// 				},
	// 				error: (error: HttpErrorResponse) => {
	// 					console.log(error)
	// 					alert(error.message)
	// 				}
	// 			})

	// 		} else {
	// 			this.errorstring = "Note: Invalid input ratios (Must be in range of 0 to 1"
	// 			this.toggleErrorString = true
	// 			this._snackBar.open("Note: Invalid input ratios (Must be in range of 0 to 1", '\u2716')
	// 		}
	// 	} else {
	// 		this.errorstring = "Note: All fields are required"
	// 		this.toggleErrorString = true
	// 		this._snackBar.open("Note: All fields are required", '\u2716')
	// 	}
	// }



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



	getAllJunctionSpecificDataFromDB() {
		this.junctionSpecificsService.getAllJunctionDistrictMaps().subscribe({
			next: (response) => {
				for (const element of Object.values(response)) {
					this.junctionDistrictMaps.set(element['junctionName'], element['district'])
				}

				if (response != '') {

					this.junctionSpecificsService.getAllJunctionRoadwayWidthMaps().subscribe({
						next: (response) => {
							for (const element of Object.values(response)) {
								this.junctionRoadwayWidthMaps.set(element['junctionName'], element['roadwayWidth'])
							}
							
							if (response != '') {

								this.junctionSpecificsService.getAllRoadwayWidthMaxVehiclesMaps().subscribe({
									next: (response) => {
										for (const element of Object.values(response)) {
											this.roadwayWidthMaxVehiclesMaps.set(element['roadwayWidth'], element['maxVehicles'])
										}

										this.currentDistrict = this.junctionDistrictMaps.get(this.junctionChoice)!
										this.currentRoadwayWidth = parseInt(this.junctionRoadwayWidthMaps.get(this.junctionChoice)!)
										this.currentMaxVehicles = this.roadwayWidthMaxVehiclesMaps.get(this.currentRoadwayWidth)!

										console.log(this.roadwayWidthMaxVehiclesMaps)
										console.log(this.junctionRoadwayWidthMaps)
										console.log(this.junctionDistrictMaps);
										

										if (response != '') {
											this.junctionSpecificDetailsProvided = true
										}
									},
									error: (error: HttpErrorResponse) => {
										console.log(error)
										alert(error)
									}
								})
							}
						},
						error: (error: HttpErrorResponse) => {
							console.log(error)
							alert(error)
						}
					})
				}
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error)
			}
		})
	}



	start() {
		if (this.csvDataParsed) {
			this.toggleErrorString = false
			this.startProcess = true
			this.dataSource = this.csvData.slice(this.index, this.index + 5)
			this.toggleDataVisualizationTable = true
			this.flaskService.getPlot().subscribe({
				next: (response) => {
						this.recievedPlotData = response
						this.junctionChoice = this.junctions[0]
						this.changeJunctionToBePlotted()




						if (this.inputTestRatio != '' && this.inputJunction != '' && this.time != '' && this.inputTime != '' && this.inputAlgorithm != '') {
							console.log('here')
							this.testRatio = parseFloat(this.inputTestRatio)
							this.trainRatio = parseFloat(this.inputTrainRatio)
							let trainingSpecifics: Object = {
								testRatio: this.inputTestRatio,
								junction: this.inputJunction,
								time: this.inputTime,
								timeFormat: this.time,
								algorithm: this.inputAlgorithm
							}
							this.startedTraining = true;
							this.propService.dataset = this.dataset
							this.propService.inputJunction = this.inputJunction
							this.propService.inputTime = this.inputTime
							this.propService.time = this.time
							this.propService.testRatio = parseFloat(this.inputTestRatio)
							this.propService.trainRatio = 1 - parseFloat(this.inputTestRatio)

							this.flaskService.sendTrainingSpecifics(trainingSpecifics).subscribe({
								next: (response) => {
									console.log(response)
									this.flaskService.predict().subscribe({
										next: (response) => {
											this.predictionReady = true

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


															this.flaskService.getAllJunctions().subscribe({
																next: (response) => {
																	this.propService.junctions = Object.values(response)
																	this.junctions = this.propService.junctions
																	this.autoTrained = this.propService.autoTrained

																	this.flaskService.getResultTable().subscribe({
																		next: (response) => {
																			this.duration = parseInt(this.propService.inputTime)
																			this.junctionChoice = this.propService.inputJunction
																			this.allJunctionsPredictedData = response
																			this.allJunctionsPredictedData = this.allJunctionsPredictedData[0]
																			this.allJunctionsPlotData = this.propService.predictionPlotData[0]
																			this.plotDataReady = true
																			this.junctions = []
																			this.junctions.push(this.junctionChoice)
																			this.changeJunctionToBeRendered()
																			this.getAllJunctionSpecificDataFromDB()
																		},
																		error: (error: HttpErrorResponse) => {
																			console.log(error)
																			alert(error)
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
						} else {
							this.errorstring = "Please fill all the fields"
							this.toggleErrorString = true
						}



					},
				error: (error: HttpErrorResponse) => { console.log(error.message) }
			})
			if (this.index !== 0) { this.classForPreviousButton = "page-item" }
		} else {
			this.errorstring = 'Please provide a dataset'
			this.toggleErrorString = true
		}




	}
	

	// start() {


	// 	// check whether the fields have no value
	// 	if (this.inputJunction !== "" && this.inputTime !== "") {

	// 		this.propService.inputJunction = this.inputJunction
	// 		this.propService.inputTime = this.inputTime
	// 		this.propService.time = this.time
	// 		// set the object to be sent to back-end
	// 		this.propService.obj = { 
	// 			junction: this.inputJunction, 
	// 			time: this.inputTime,
	// 			timeFormat: this.time,
	// 			algorithm: this.inputAlgorithm
	// 		}

	// 		// no errors in validation
	// 		// hence don't show error alert
	// 		this.toggleErrorString = false

	// 		// set startedTraining to true to show spinner till training and processing has completed
	// 		this.startedTraining = true;



	// 		this.flaskService.sendInput(this.propService.obj).subscribe({
	// 			next: (response) => {

	// 				// send input junction and months to the backend via function call in flask service
	// 				this.flaskService.predict().subscribe({
	// 					next: (response) => {

	// 						// training has completed, disable spinner and show results
	// 						this.startedTraining = false;

	// 						this.autoTrained = false
	// 						this.propService.autoTrained = false

	// 						// set datetime and vehicles variables to values recieved from backend as response
	// 						// for table
	// 						this.propService.predictionPlotData = Object.values(response)
							

	// 						this.flaskService.getModelSummary().subscribe({
	// 							next: (response) => {
	// 								this.futurePredictionsReadyHidden = false
	// 								this.modelSummary = Object.values(response)




	// 								// get comparison data (actual vs predicted) from backend
	// 								this.flaskService.getActualPredicted().subscribe({
	// 									next: (response) => {

	// 										// switch to display comparison table
	// 										this.predictedTableReady = true

	// 										// get data in a variable
	// 										this.tablePredicted = response

	// 										// get the row data from table data recieved as response
	// 										this.dataSourcePredicted = Object.values(response).slice(this.predictedTableIndex, this.predictedTableIndex + 5)

	// 										// get total number of records
	// 										this.numberOfRecordsPredicted = Object.values(response).length
	// 									},
	// 									error: (error: HttpErrorResponse) => {
	// 										console.log(error)
	// 										alert(error.message)
	// 									}
	// 								})

	// 								// get comparison data (actual vs predicted for plotting) from backend
	// 								this.flaskService.getActualPredictedForPlot().subscribe({
	// 									next: (response) => {

	// 										this.comparisonChartHidden = false
	// 										// set it to the variable 
	// 										this.predictionPlotData = response

	// 										// differentiate plot data into actual, predicted and indices
	// 										this.actual = Object.values(response)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
	// 										this.predicted = Object.values(response)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
	// 										this.labels = Object.values(response)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)

	// 										// get total number of records
	// 										this.numberOfPlotDataEntries = Object.values(response)[0]['actual'].length

	// 										// destroy comparison chart if already in use
	// 										if (this.predictedChart != null) { this.predictedChart.destroy() }

	// 										// then plot comparison chart
	// 										this.predictedChart = new Chart("predictedChart", {
	// 											type: 'line',
	// 											data: {
	// 												labels: this.labels,
	// 												datasets: [
	// 													{
	// 														label: "actual",
	// 														backgroundColor: "white",
	// 														borderWidth: 1,
	// 														borderColor: "#900",
	// 														fill: false,
	// 														data: this.actual
	// 													},
	// 													{
	// 														label: "predicted",
	// 														backgroundColor: "white",
	// 														borderWidth: 1,
	// 														borderColor: "#090",
	// 														fill: false,
	// 														data: this.predicted
	// 													}
	// 												]
	// 											},
	// 											options: {
	// 												maintainAspectRatio: true,
	// 												scales: {
	// 													y: {
	// 														beginAtZero: true,
	// 														title: {
	// 															display: true,
	// 															text: 'Vehicles'
	// 														}
	// 													},
	// 													x: {
	// 														title: {
	// 															display: true,
	// 															text: 'DateTime'
	// 														}
	// 													}
	// 												}
	// 											}
	// 										});
	// 									},
	// 									error: (error: HttpErrorResponse) => {
	// 										console.log(error)
	// 										alert(error.message)
	// 									}
	// 								})





	// 								this.flaskService.getAccuracies().subscribe({
	// 									next: (response) => {
	// 										this.gotAccuracies = true
	// 										this.accuracies = Object.values(response)
	// 										this.accuracyBarChartHidden = false
											
	// 										let algorithms: Array<string> = []
	// 										let accuracyScores: Array<number> = []
	// 										for (let i of this.accuracies) {
	// 											algorithms.push(i.model)
	// 											accuracyScores.push(i.accuracyscore)
	// 										}
	// 										this.barChart(algorithms, accuracyScores)
	// 									},
	// 									error: (error: HttpErrorResponse) => {
	// 										console.log(error)
	// 										alert(error.message)
	// 									}
	// 								})



	// 							},
	// 							error: (error: HttpErrorResponse) => {
	// 								console.log(error)
	// 								alert(error.message)
	// 							}
	// 						})

	// 					},
	// 					error: (error: HttpErrorResponse) => {
	// 						console.log(error)
	// 						alert(error.message)
	// 					}
	// 				})
	// 			},
	// 			error: (error: HttpErrorResponse) => {
	// 				console.log(error)
	// 				alert(error.message)
	// 			}
	// 		})
	// 	}

	// 	// if error in validation
	// 	else {
	// 		this.errorstring = "Note: All fields are required"
	// 		this.toggleErrorString = true
	// 		this._snackBar.open("Note: All fields are required", '\u2716')
	// 	}
	// }
}

