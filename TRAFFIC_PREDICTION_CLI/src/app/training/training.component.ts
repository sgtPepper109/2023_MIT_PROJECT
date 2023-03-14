import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PropService } from '../services/propService/prop.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { FlaskService } from '../services/flaskService/flask.service';
import { Chart, TimeScale } from 'chart.js/auto';
import { FormBuilder } from '@angular/forms';
import { JunctionSpecificsService } from '../services/junctionSpecificsService/junction-specifics.service';
import { ngxCsv } from 'ngx-csv';
import { SampleCsvData } from 'src/assets/sample';
import { transition } from '@angular/animations';

@Component({
	selector: 'app-training',
	templateUrl: './training.component.html',
	styleUrls: ['./training.component.css']
})

export class TrainingComponent implements OnInit {
	constructor(
		private sampleCsv: SampleCsvData,
		private http: HttpClient,
		private router: Router,
		private propService: PropService,
		private _snackBar: MatSnackBar,
		private ngxCsvParser: NgxCsvParser,
		private flaskService: FlaskService,
		private _formBuilder: FormBuilder,
		private junctionSpecificsService: JunctionSpecificsService,
	) {}

	alreadyTrained: boolean = false
	listAllTrained: Array<Array<any>> = []
	file: any
	junctionSpecificDataAvailable: boolean = false;
	fileProcessing: boolean = false
	datasetUploaded: boolean = false
	modelSummaryReady: boolean = false
	futurePredictionsPlotData: any
	futurePredictionsTableData: any
	csvDataStored: boolean = false;
	junctions2: string[] = []
	predictionsOption: string = 'Line Plot'
	junctionDistrictMaps: Map<string, string> = new Map()
	junctionRoadwayWidthMaps: Map<string, string> = new Map()
	roadwayWidthMaxVehiclesMaps: Map<number, number> = new Map()
	classForNextButtonResult: string = ""
	classForPreviousButtonResult: string = ""
	allJunctionsPredictedData: any
	allJunctionsPlotData: any
    plotDataReady: boolean = false
	duration: number = 0
	existingDataOption: string = 'Line Plot'
	comparisonOption: string = 'Line Plot'
	accuracyOption: string = 'Line Plot'
	predictionReady: boolean = false
	isLinear: boolean = false
	gotAccuracies: boolean = false

	accuracyBarChartHidden: boolean = true
	toggleAccuracyBarChart: boolean = false

	startProcess: boolean = false
	junctionChoice: string = ""
	maxVehicles: number = 0
	accuracies: any
	csvRecords: object = {}
	datasetPath: string = ""
	recievedPlotData: any
	vehicles: Array<any> = []  // Vehicles array to display on y axis of chart
	datetime: Array<any> = [] // DateTime array to display on x axis of chart
	inputJunction: string = ""// input variables for junction and months
	inputTime: string = ""
	inputAlgorithm: string = "Random Forest Regression"
	time: string = "Days"
	modelSummary: any
	keys: any
	comparisonDataRepresentationType: string = "Table"
	predictedChartIndex: number = 0  // holds paginator index for comparison chart
	toggleComparisonTable: boolean = true
	comparisonTableReady: boolean = false
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
	comparisonChartData: object = {}  // holds data for comparison chart
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
	futurePredictionsReady: boolean = false
	actual: Array<number> = []  // Actual values array for plotting on chart for comparison
	predicted: Array<number> = []  // Predicted values array for plotting on chart for comparison
	difference: Array<number> = []
	comparisonTableData: object = {}  // holds all predicted values table data
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
	junctionsAvailableForTraining: Array<string> = []

	ngOnInit() { 

		/* TODO document why this method 'ngOnInit' is empty */
		this.junctionSpecificsService.getAllJunctions().subscribe({
			next: (response) => {
				this.junctions = Object.values(response)
				this.junctions2 = this.junctions
				this.propService.junctions = this.junctions
			},
			error: (error: HttpErrorResponse) => {
				alert(error.message)
			}
		})
		this.flaskService.getListOfAllTrained().subscribe({
			next: (response) => {
				this.listAllTrained = Object.values(response)
			},
			error: (error: HttpErrorResponse) => {
				alert(error.message)
			}
		})
		// this.flaskService.getAllUniqueJunctions().subscribe({
		// 	next: (response) => {
		// 		console.log(response)
		// 		this.junctionsAvailableForTraining = Object.values(response)
		// 	},
		// 	error: (error: HttpErrorResponse) => {
		// 		console.log(error)
		// 		alert(error.message)
		// 	}
		// })
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

	setVehiclesAndDateTime(param1: any, param2: any) {
		this.vehiclesToBePlotted = param1
		this.dateTimeToBePlotted = param2
	}
	plotFuturePredictions(z: any, x: any, y: any) {
		// prediction is done
		this.futurePredictionsChartHidden = false


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
						fill: false,
						pointRadius: 2
					},
					{
						label: 'Max Vehicles at Junction ',
						data: z,
						borderWidth: 1,
						borderColor: '#0000FF',
						fill: false,
						pointRadius: 2
					},
					// {
					// 	label: 'Max Value in prediction',
					// 	data: this.maxInPlotArray,
					// 	borderwidth: 1,
					// 	bordercolor: '#090',
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

	downloadSample(file: any = '/assets/sample.csv') {
		const options = {
			fieldSeparator: ',',
			quoteStrings: '',
			decimalseparator: '.',
			showLabels: true,
			useBom: true,
			noDownload: false,
			headers: ['DateTime', 'Vehicles', 'Junction']
		};
		try {
			new ngxCsv(this.sampleCsv.sampleCsvData, "sample", options);
		} catch (error) {
			alert(error)
		}

	}

	fileChangeListener($event: any): void {

		this.fileProcessing = true
		const files = $event.srcElement.files;
		let fileName = files[0]['name']
		let header: boolean = true
		header = (header as unknown as string) === 'true' || header === true;

		const arr = fileName.split('.')
		if (arr[arr.length - 1] === 'csv' || arr[arr.length - 1] === 'data' || arr[arr.length - 1] === 'xlsx') {

			this.ngxCsvParser.parse(files[0], { header: header, delimiter: ',', encoding: 'utf8' })
			.pipe().subscribe({
				next: (result): void => {

						
					this.flaskService.sendCsvData(result).subscribe({
						next: (response) => {
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
							this.datasetUploaded = true
							this.fileProcessing = false
							this.flaskService.getAllUniqueJunctions().subscribe({
								next: (response) => {
									this.datasetUploaded = true
									this.fileProcessing = false
									this.junctionsAvailableForTraining = Object.values(response)

									for (let element of this.junctionsAvailableForTraining) {
										if (this.junctions2.includes(element) == false) {
											this.junctions2.push(element)
										}
									}

								},
								error: (error: HttpErrorResponse) => {
									alert(error.message)
								}
							})
						},
						error: (error: HttpErrorResponse) => {
							alert(error.message)
						}
					})
				},
				error: (error: NgxCSVParserError): void => {
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

	changeJunctionToBePlotted() {
		this.show(this.junctionChoice)
	}

	show(param1: string) {
		this.vehiclesVsDateTimeChartHidden = false; 

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
		for (const element of this.datetime) {
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
			this.dataSourceResult = this.futurePredictionsTableData.slice(this.indexResult, this.indexResult + 10)

			// if index is pointing to last 10 records from the csv data then disable next button in paginator
			if (this.indexResult === Object.values(this.futurePredictionsTableData).length - 10) {
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
			this.dataSourceResult = this.futurePredictionsTableData.slice(this.indexResult, this.indexResult + 10)

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
						pointRadius: 2
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

			// set next 5 row values from comparison table data (this.comparisonTableData) to the dataSource variable
			// so that it can be shown in table
			this.dataSourcePredicted = Object.values(this.comparisonTableData).slice(this.predictedTableIndex, this.predictedTableIndex + 5)

			// if index is pointing to last 5 records from the csv data then disable next button in paginator
			if (this.predictedTableIndex === Object.values(this.comparisonTableData).length - 5) {
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

			// set next 5 row values from comparison table data (this.comparisonTableData) to the dataSource variable 
			// so that it can be shown in table
			this.dataSourcePredicted = Object.values(this.comparisonTableData).slice(this.predictedTableIndex, this.predictedTableIndex + 5)

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

			// set plot variables to get actual, predicted and labels of next 10 predictions from comparisonChartData
			this.actual = Object.values(this.comparisonChartData)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.predicted = Object.values(this.comparisonChartData)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.difference = Object.values(this.comparisonChartData)[0]['difference'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.labels = Object.values(this.comparisonChartData)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)

			// plot comparison chart of these indices 
			this.compareChart(this.labels, this.actual, this.predicted, this.difference)

			// if index is pointing to last 5 records from the plot data then disable next button in paginator
			if (this.predictedChartIndex === Object.values(this.comparisonChartData).length - 10) {
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
			this.actual = Object.values(this.comparisonChartData)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.predicted = Object.values(this.comparisonChartData)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.difference = Object.values(this.comparisonChartData)[0]['difference'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.labels = Object.values(this.comparisonChartData)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)


			// plot comparison chart
			this.compareChart(this.labels, this.actual, this.predicted, this.difference)

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
	compareChart(labels: number[], actual: number[], predicted: number[], difference: number[]) {
		// if comparison chart (canvas) is in use then destroy it
		if (this.predictedChart != null) { this.predictedChart.destroy() }
		this.predictedChart = new Chart("predictedChart", {
			data: {
				labels: labels,
				datasets: [
					{
						type: 'line',
						label: "actual",
						backgroundColor: "white",
						borderWidth: 1,
						borderColor: "#900",
						fill: false,
						pointRadius: 2,
						data: actual
					},
					{
						type: 'line',
						label: "predicted",
						backgroundColor: "white",
						borderWidth: 1,
						borderColor: "#090",
						fill: false,
						pointRadius: 2,
						data: predicted
					},
					{
						type: 'bar',
						label: "difference",
						data: difference
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


	changeTrainedModel() {
		console.log('intrained')
	}

	// navigate to page2
	navigateToPage2() {
		this.router.navigate(['/prediction'])
	}


	navigateToPredictions() {
		this.router.navigate(['/prediction'])
	}

	barChart(param1: Array<string>, param2: Array<number>) {
		if (this.accuracyBarChart != null) { this.accuracyBarChart.destroy() }
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



	async getAllJunctionSpecificDataFromDBandRenderPredictions() {
		this.junctionSpecificsService.getAllJunctionDistrictMaps().subscribe({
			next: (response) => {
				for (const element of Object.values(response)) {
					this.junctionDistrictMaps.set(element['junctionName'], element['district'])
					
					if (element['junctionName'] == this.inputJunction) {
						this.junctionSpecificDataAvailable = true
					}

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

										this.currentDistrict = this.junctionDistrictMaps.get(this.inputJunction)!
										this.currentRoadwayWidth = parseInt(this.junctionRoadwayWidthMaps.get(this.inputJunction)!)
										this.currentMaxVehicles = this.roadwayWidthMaxVehiclesMaps.get(this.currentRoadwayWidth)!

										this.renderPredictions(this.futurePredictionsPlotData, this.futurePredictionsTableData)

										if (response != '') {
											this.junctionSpecificDetailsProvided = true
										}
									},
									error: (error: HttpErrorResponse) => {
										alert(error)
									}
								})
							}
						},
						error: (error: HttpErrorResponse) => {
							alert(error)
						}
					})
				}
			},
			error: (error: HttpErrorResponse) => {
				alert(error)
			}
		})
	}





	startTraining() {
		this.predictionReady = false
		this.comparisonChartHidden = false
		this.modelSummaryReady = false
		this.comparisonTableReady = false
		this.modelSummary = []
		this.csvDataStored = true
		this.startedTraining = true
		if (this.csvDataStored) {
			this.dataSource = this.csvData.slice(this.index, this.index + 5)
			this.numberOfRecords = this.csvData.length
			this.testRatio = parseFloat(this.inputTestRatio)
			this.startProcess = true
			this.toggleErrorString = false
			if (this.inputJunction != '' && this.inputTestRatio != '' && this.inputAlgorithm != '') {
				interface trainingDetails {
					junction: string,
					testRatio: number,
					algorithm: string
				}

				let trainingSpecificData: trainingDetails = {
					junction: this.inputJunction,
					testRatio: parseFloat(this.inputTestRatio),
					algorithm: this.inputAlgorithm
				}
				this.alreadyTrained = false
				for (const element of this.listAllTrained) {
					if (element[0] == trainingSpecificData['junction']) {
						if (element[1] == trainingSpecificData['algorithm']) {
							if (element[2] == trainingSpecificData['testRatio'].toString()) {
								this.alreadyTrained = true
								console.log('already trained')
							}
						}
					}
				}
				console.log('al',this.alreadyTrained)

				
				if (this.alreadyTrained || this.junctionsAvailableForTraining.includes(this.inputJunction)) {

					// existing data
					this.flaskService.getPlot().subscribe({
						next: (response) => {
							this.recievedPlotData = response
							this.junctionChoice = this.inputJunction
							this.toggleDataVisualizationTable = true
							this.changeJunctionToBePlotted()
						},
						error: (error: HttpErrorResponse) => {
							alert(error.message)
						}
					})



					this.flaskService.sendTrainingSpecifics(trainingSpecificData).subscribe({
						next: (response) => {

							this.flaskService.train().subscribe({
								next: (response) => {
									this.predictionReady = true
									this.startedTraining = false

									// switch to display comparison table
									this.comparisonTableReady = true
									// get data in a variable
									this.comparisonTableData = response
									// get the row data from table data recieved as response
									this.dataSourcePredicted = Object.values(response).slice(this.predictedTableIndex, this.predictedTableIndex + 5)
									// get total number of records
									this.numberOfRecordsPredicted = Object.values(response).length


									this.flaskService.getListOfAllTrained().subscribe({
										next: (response) => {
											console.log(response)
											this.listAllTrained = Object.values(response)
											console.log(this.listAllTrained)
										},
										error: (error: HttpErrorResponse) => {
											alert(error.message)
										}
									})


									this.flaskService.getActualPredictedForPlot().subscribe({
										next: (response) => {
											this.comparisonChartHidden = false
											// set it to the variable 
											this.comparisonChartData = response

											// differentiate plot data into actual, predicted and indices
											this.actual = Object.values(response)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
											this.predicted = Object.values(response)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
											this.difference = Object.values(response)[0]['difference'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
											this.labels = Object.values(response)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)

											// get total number of records
											this.numberOfPlotDataEntries = Object.values(response)[0]['actual'].length

											// destroy comparison chart if already in use
											if (this.predictedChart != null) { this.predictedChart.destroy() }

											// then plot comparison chart
											this.compareChart(this.labels, this.actual, this.predicted, this.difference)

										},
										error: (error: HttpErrorResponse) => {
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
												algorithms.push(i.algorithm)
												accuracyScores.push(i.accuracyScore)
											}
											this.barChart(algorithms, accuracyScores)
										},
										error: (error: HttpErrorResponse) => {
											alert(error.message)
										}
									})

									this.flaskService.getModelSummary().subscribe({
										next: (response: any) => {
											this.modelSummary = Object.values(response)
											this.modelSummaryReady = true
										},
										error: (error: HttpErrorResponse) => {
											alert(error.message)
										}
									})


								},
								error: (error: HttpErrorResponse) => {
									alert(error.message)
								}
							})
						},
						error: (error: HttpErrorResponse) => {
							alert(error.message)
						}
					})
				} else {
					this.startedTraining = false
					this._snackBar.open('Note: ' + this.inputJunction + ' does not exist in the dataset (required for training)', '\u2716')
				}


			} else {
				this.startedTraining = false
				this._snackBar.open('Note: All fields are required', '\u2716')
			}
		}
	}


	renderPredictions(futurePredictionsPlotData: any, futurePredictionsTableData: any) {
		// display only these columns
		this.displayedColumnsResult = ['DateTime', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];

		// get all row values from the response recieved to show in table
		this.dataSourceResult = futurePredictionsTableData.slice(this.indexResult, this.indexResult + 10)

		// get total number of records from table data
		this.numberOfRecordsResult = futurePredictionsTableData.length

		if (this.plotDataReady) {
			if (this.plotDataReady) {
				this.setVehiclesAndDateTime(
					futurePredictionsPlotData[0]['vehicles'], 
					futurePredictionsPlotData[0]['datetime']
				)
				let maxVehiclesCapacityArray: Array<number> = []
				for (const element of this.dateTimeToBePlotted) {
					maxVehiclesCapacityArray.push(this.currentMaxVehicles)
				}
				this.plotFuturePredictions(maxVehiclesCapacityArray, this.dateTimeToBePlotted, this.vehiclesToBePlotted)
			}
		}
	}


	predict() {
		if (this.inputTime != '' && this.time != '') {
			let timeToBePredicted: object = {
				timePeriod: this.inputTime,
				timeFormat: this.time
			}

			this.flaskService.sendInputTimeToPredict(timeToBePredicted).subscribe({
				next: (response) => {
					this.flaskService.predictAgainstTime().subscribe({
						next: (response) => {
							this.futurePredictionsPlotData = response
							this.plotDataReady = true
							this.flaskService.getFuturePredictionsTable().subscribe({
								next: (response) => {
									this.futurePredictionsTableData = Object.values(response)
									this.getAllJunctionSpecificDataFromDBandRenderPredictions()
									this.futurePredictionsReady = true
								},
								error: (error: HttpErrorResponse) => {
									alert(error.message)
								}
							})
						},
						error: (error: HttpErrorResponse) => {
							alert(error.message)
						}
					})
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
				}
			})
		} else {
			this._snackBar.open('Note: provide time')
		}
	}


}