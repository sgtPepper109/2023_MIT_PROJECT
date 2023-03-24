import { Component, OnInit } from '@angular/core';
import { PropService } from '../services/propService/prop.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlaskService } from '../services/flaskService/flask.service';
import { Chart } from 'chart.js/auto';
import { ngxCsv } from 'ngx-csv';
import { Router, NavigationEnd } from '@angular/router';
import { tableRecord } from '../interfaces/all-interfaces';
import { JunctionSpecificsService } from '../services/junctionSpecificsService/junction-specifics.service';


@Component({
	selector: 'app-page2',
	templateUrl: './predictions.component.html',
	styleUrls: ['./predictions.component.css']
})
export class PredictionsComponent implements OnInit {
	constructor(
		private router: Router,
		private propService: PropService,
		private _snackBar: MatSnackBar,
		private flaskService: FlaskService,
		private junctionSpecificsService: JunctionSpecificsService
	) {
	}

	countNumberOfDaysBeforeFirstTreatment: number = 0
	firstTreatmentRecommendationTime: string = ""
	firstTreatmentRecommendationVehicles: number = 0
	showBy: string = ""
	showByArray: Array<string> = []
	yearsPaginatorShow: boolean = false
	maxVehicles: Array<number> = []
	yearsPaginatorPreviousButtonDisabled: boolean = true
	yearsPaginatorNextButtonDisabled: boolean = false
	yearsIndex: number = 0
	accuracyComparisonTableData: Array<tableRecord> = []
	toggleAccuracyTable: boolean = true
	accuracyPie: any
	accuraciesOption: string = "Line Plot"
	currentPie: string = ""
	reload: boolean = false
	scrollnumber: number = 0
	showMaxCapacity: boolean = false
	numberOfTimesCrossedMaxCapacity: number = 0
	junctionComparisonData: any
	predictionsReady: boolean = false
	predictionsOption: string = 'Line Plot'
	currentDistrict: string = ""
	currentRoadwayWidth: number = 0
	currentMaxVehicles: number = 0
	junctionDistrictMaps: Map<string, string> = new Map()
	junctionRoadwayWidthMaps: Map<string, string> = new Map()
	roadwayWidthMaxVehiclesMaps: Map<number, number> = new Map()
	junctionSpecificDetailsProvided: boolean = false
	autoTrained: boolean = this.propService.autoTrained
	accuracyComparison: any
	isLinear: boolean = false
	junctions: Array<string> = []
	recievedPlotData: object = {}  // Object containing vehicles vs datetime information of all junctions
	vehicles: Array<number> = []  // Vehicles array to display on y axis of chart
	datetime = []  // DateTime array to display on x axis of chart
	actual: Array<number> = []  // Actual values array for plotting on chart for comparison
	predicted: Array<number> = []  // Predicted values array for plotting on chart for comparison
	labels = []  // Index (prediction number) array for plotting
	maxLimitArray: number[] = []
	maxInPlotArray: number[] = []

	plotDataReady: boolean = false
	junctionToBeRendered: number = 1

	vehiclesToBePlotted: any
	dateTimeToBePlotted: any
	errorstring: string = "" // error message to be displayed on the screen
	junctionChoice: string = ""
	allJunctionsPlotData: any
	currentJunctionPlotData: any

	dataVisualizationType: string = "Table"
	dataVisualizationJunctionName: string = ""
	junctionToBePlotted: string = ""
	futurePredictionsRepresentationType: string = "Table"
	comparisonDataRepresentationType: string = "Table"
	inputJunction: string = "Choose Junction"// input variables for junction and months
	inputTime: string = ""
	duration: number = 0
	inputAlgorithm: string = "Random Forest Regression"
	time: string = ""
	modelSummary: Array<string> = [] 
	keys: any
	obj = {} // object to be passed to the back-end that comprises of junction and months

	allJunctionsPredictedData: any
	currentJunctionsPredictedData: any

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

	displayedColumns: Array<string> = []  // array that holds all column values that will be shown in mat-table
	displayedColumnsResult: Array<string> = []  // array that holds all column values that will be shown in result mat-table
	displayedColumnsPredicted: Array<string> = ['Actual', 'Predicted']  // only two columns for predicted values table

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




	navigateToTraining() {
		this.router.navigate(['/training'])
	}


	navigateToAdminInputs() {
		this.router.navigate(['/junctionProperties'])
	}

	changeAccuraciesOption() {
		if (this.accuraciesOption == 'Line Plot') {
			this.toggleAccuracyTable = true
		} else {
			this.toggleAccuracyTable = false
		}
	}

	changePredictionsOption() {
		if (this.predictionsOption == 'Line Plot') {
			this.toggleFuturePredictionsTable = true
		} else {
			this.toggleFuturePredictionsTable = false
		}
	}
	


	setVehiclesAndDateTime(param1: any, param2: any) {
		this.vehiclesToBePlotted = param1
		this.dateTimeToBePlotted = param2
	}


	barChart(param1: Array<string>, param2: Array<number>) {
		if (this.accuracyComparison != null) { this.accuracyComparison.destroy() }
		this.accuracyComparison = new Chart("accuracyComparison", {
			type: 'bar',
			data: {
				labels: param1,
				datasets: [
					{
						label: "Junctions",
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
							text: 'Accuracy'
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
	

	plotFuturePredictions(x: any, y: any, z: any) {
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
						fill: false
					},
					{
						label: 'Maximum Capacity of ' + this.junctionChoice,
						data: z,
						borderWidth: 1,
						borderColor: '#0000FF',
						fill: false
					},
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
				responsive: true,
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
			if (this.indexResult === Object.values(this.currentJunctionsPredictedData).length - 10) {
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




	async getAllJunctionSpecificDataFromDB() {
		let promise = new Promise<any>((resolve, reject) => {

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

											resolve('gotDBData')
											// this.renderPredictions(this.futurePredictionsPlotData, this.futurePredictionsTableData)

											if (response != '') {
												this.junctionSpecificDetailsProvided = true
											} else {
												// review later
											}
										},
										error: (error: HttpErrorResponse) => {
											alert(error)
										}
									})
								} else {
									// review later
								}
							},
							error: (error: HttpErrorResponse) => {
								alert(error)
							}
						})
					} else {
						// review later
					}
				},
				error: (error: HttpErrorResponse) => {
					alert(error)
				}
			})
		})
		return promise

	}

	
	previousMonth() {
	// 	console.log(this.yearsIndex)
	// 	if (this.yearsIndex <= 0) {
	// 		this.yearsPaginatorPreviousButtonDisabled = true
	// 	}
	// 	this.yearsPaginatorNextButtonDisabled = false
	// 	this.yearsIndex -= (744)
	// 	this.setVehiclesAndDateTime(
	// 		this.currentJunctionPlotData[0]['vehicles'].slice(this.yearsIndex, this.yearsIndex + 744), 
	// 		this.currentJunctionPlotData[0]['datetime'].slice(this.yearsIndex, this.yearsIndex + 744)
	// 		// this.currentJunctionPlotData[0]['vehicles'].slice(0, 13),
	// 		// this.currentJunctionPlotData[0]['datetime'].slice(0, 13)
	// 	)
	// 	this.maxVehicles = Array(this.dateTimeToBePlotted.length).fill(this.currentMaxVehicles)
	// 	this.plotFuturePredictions(this.dateTimeToBePlotted, this.vehiclesToBePlotted, this.maxVehicles)
	// 	console.log(this.yearsIndex)
	}

	nextMonth() {
	// 	console.log(this.yearsIndex)
	// 	this.yearsIndex += 744
	// 	this.setVehiclesAndDateTime(
	// 		this.currentJunctionPlotData[0]['vehicles'].slice(this.yearsIndex, this.yearsIndex + 744), 
	// 		this.currentJunctionPlotData[0]['datetime'].slice(this.yearsIndex, this.yearsIndex + 744)
	// 		// this.currentJunctionPlotData[0]['vehicles'].slice(0, 13),
	// 		// this.currentJunctionPlotData[0]['datetime'].slice(0, 13)
	// 	)
	// 	this.yearsPaginatorPreviousButtonDisabled = false
	// 	this.maxVehicles = Array(this.dateTimeToBePlotted.length).fill(this.currentMaxVehicles)
	// 	this.plotFuturePredictions(this.dateTimeToBePlotted, this.vehiclesToBePlotted, this.maxVehicles)
	// 	console.log(this.yearsIndex)
	}

	renderPredictions() {
		this.numberOfTimesCrossedMaxCapacity = 0
		this.currentDistrict = this.junctionDistrictMaps.get(this.junctionChoice)!
		this.currentRoadwayWidth = parseInt(this.junctionRoadwayWidthMaps.get(this.junctionChoice)!)
		this.currentMaxVehicles = this.roadwayWidthMaxVehiclesMaps.get(this.currentRoadwayWidth)!
		this.currentJunctionsPredictedData = this.allJunctionsPredictedData[this.junctionChoice]
		this.numberOfRecordsResult = this.currentJunctionsPredictedData.length
		this.dataSourceResult = this.currentJunctionsPredictedData.slice(this.indexResult, this.indexResult + 10)
		this.currentJunctionPlotData = this.allJunctionsPlotData[this.junctionChoice]


		if (this.time == 'Years') {
			this.setVehiclesAndDateTime(
				this.currentJunctionPlotData[0]['vehicles'], 
				this.currentJunctionPlotData[0]['datetime']
				// this.currentJunctionPlotData[0]['vehicles'].slice(0, 13),
				// this.currentJunctionPlotData[0]['datetime'].slice(0, 13)
			)
		} else {
			this.setVehiclesAndDateTime(
				this.currentJunctionPlotData[0]['vehicles'], 
				this.currentJunctionPlotData[0]['datetime']
			)
		}


		this.maxVehicles = Array(this.dateTimeToBePlotted.length).fill(this.currentMaxVehicles)
		this.plotFuturePredictions(this.dateTimeToBePlotted, this.vehiclesToBePlotted, this.maxVehicles)


		this.firstTreatmentRecommendationTime = ""
		this.firstTreatmentRecommendationVehicles = 0
		this.countNumberOfDaysBeforeFirstTreatment = 0
		for (let i = 0; i < this.vehiclesToBePlotted.length; i++) {
			this.countNumberOfDaysBeforeFirstTreatment ++
			if (this.vehiclesToBePlotted[i] > this.currentMaxVehicles) {
				this.firstTreatmentRecommendationTime = this.dateTimeToBePlotted[i]
				this.firstTreatmentRecommendationVehicles = this.vehiclesToBePlotted[i]
				break;
			}
		}

		for (let element of this.vehiclesToBePlotted) {
			if (element > this.currentMaxVehicles) {
				this.numberOfTimesCrossedMaxCapacity ++
			}
		}
		if (this.numberOfTimesCrossedMaxCapacity === 0) {
			this.showMaxCapacity = false
		} else {
			this.showMaxCapacity = true
		}
	}


	renderJunctionComparison() {
		let junctionsAxis: Array<string> = Object.keys(this.junctionComparisonData)
		let comparisonAxis: Array<number> = Object.values(this.junctionComparisonData)
		this.barChart(junctionsAxis, comparisonAxis)
	}





	async getMasterData() {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.getMasterTrainedDataPlot().subscribe({
				next: (response) => {
					this.allJunctionsPlotData = response

					this.junctions = Object.keys(response)
					if (this.junctionChoice == "") {
						this.dataVisualizationJunctionName = this.junctions[0]
						this.junctionToBePlotted = this.junctions[0]
						this.junctionChoice = this.junctions[0]
					}
					if (this.currentPie == "") {
						this.currentPie = this.junctions[0]
					}
					this.flaskService.getMasterTrainedDataForTable().subscribe({
						next: (response) => {
							this.resultTableReady = true
							this.allJunctionsPredictedData = response
							this.predictionsReady = true
							this.flaskService.getMasterTrainedJunctionsAccuracies().subscribe({
								next: (response) => {
									this.junctionComparisonData = response
									resolve()
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
		})
	}



	renderAll() {
		this.renderPredictions()
		this.renderJunctionComparison()
		this.renderJunctionAccuracyPie()
	}



	async setAccuracyComparisonTableData() {
		return new Promise<void>((resolve, reject) => {
			for (let i = 0; i < Object.keys(this.junctionComparisonData).length; i++) {
				let record: tableRecord = {
					junctionOrAlgorithm: Object.keys(this.junctionComparisonData)[i],
					accuracy: Object.values(this.junctionComparisonData)[i]
				}
				this.accuracyComparisonTableData.push(record)
				resolve()
			}
		})
	}



	predict() {
		this.predictionsReady = false

		let timeToBePredicted: object = {
			timePeriod: this.duration,
			timeFormat: this.time,
			showBy: this.showBy
		}
		this.flaskService.sendInputTimeToPredict(timeToBePredicted).subscribe({
			next: (response) => {
				this.getMasterData().then(() => {
					this.setAccuracyComparisonTableData().then(() => {
						this.renderAll()
					})
				})
			},
			error: (error: HttpErrorResponse) => {
				alert(error.message)
			}
		})
		
	}





	renderJunctionAccuracyPie() {
		if (this.accuracyPie != null) { this.accuracyPie.destroy() }
		this.accuracyPie = new Chart("accuracyPie", {
			type: 'pie',
			data: {
				labels: [
					'accuracy',
					'inaccuracy'
				],
				datasets: [{
					label: 'Accuracy of ' + this.currentPie,
					data: [
						this.junctionComparisonData[this.currentPie],
						1 - this.junctionComparisonData[this.currentPie]
					],
					backgroundColor: [
						'rgb(54, 162, 235)',
						'rgb(255, 99, 132)'
					],
					hoverOffset: 4
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false
			}
		})
	}

	changeShowByArray() {
		if (this.time == 'Years') {
			this.showByArray = ['Days', 'Weeks', 'Months']
			this.showBy = 'Weeks'
		}
		if (this.time == 'Months') {
			this.showByArray = ['Days', 'Weeks']
			this.showBy = 'Days'
		}
		if (this.time == 'Days') {
			this.showByArray = ['Hours', 'Days']
			this.showBy = 'Hours'
		}
	}

	ngOnInit() {

		this.getAllJunctionSpecificDataFromDB().then(() => {
			this.duration = 5
			this.time = 'Years'
			this.changeShowByArray()
			this.predict()
		})

	}
}
