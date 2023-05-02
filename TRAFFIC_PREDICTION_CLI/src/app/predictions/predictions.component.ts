import { Component, OnInit } from '@angular/core';
import { PropService } from '../services/propService/prop.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FlaskService } from '../services/flaskService/flask.service';
import { ngxCsv } from 'ngx-csv';
import { Router } from '@angular/router';
import { tableRecord, mapDataInstance } from '../interfaces/all-interfaces';
import { JunctionSpecificsService } from '../services/db/junctionSpecifics/junction-specifics.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { RecommendedService } from '../services/db/recommended/recommended.service';
import { DistrictTreatmentCountService } from '../services/db/districtTreatmentCount/district-treatment-count.service'
import * as echarts from 'echarts'
import { MatSnackBar } from '@angular/material/snack-bar';
import { RatingInfoComponent } from '../dialogs/rating-info/rating-info.component';
import { MatDialog } from '@angular/material/dialog';

declare let require: any
let geoJsonData: any = require('src/assets/maharashtra.temp.geojson.json')

@Component({
	selector: 'app-page2',
	templateUrl: './predictions.component.html',
	styleUrls: ['./predictions.component.css']
})
export class PredictionsComponent implements OnInit {
	constructor(
		private router: Router,
		private propService: PropService,
		private flaskService: FlaskService,
		private junctionSpecificsService: JunctionSpecificsService,
		private recommendedService: RecommendedService,
		private districtTreatmentCountService: DistrictTreatmentCountService,
		private _snackbar: MatSnackBar,
		public dialog: MatDialog
	) {}

	ratingOutOfFive: number =  0
	alreadyRecommended: boolean = false
	mapOptionFuturePredictions: echarts.EChartsOption = {}
	mapOptionAccuracyPie: echarts.EChartsOption = {}
	mapData: Array<mapDataInstance> = [
		{ name: 'Ahmednagar', value: 0 },
		{ name: 'Amravati', value: 0 },
		{ name: 'Bhandara', value: 0 },
		{ name: 'Beed', value: 0 },
		{ name: 'Dhule', value: 0 },
		{ name: 'Jalgaon', value: 0 },
		{ name: 'Kolhapur', value: 0 },
		{ name: 'Nanded', value: 0 },
		{ name: 'Nandurbar', value: 0 },
		{ name: 'Nashik', value: 0 },
		{ name: 'Osmanabad', value: 0 },
		{ name: 'Pune', value: 0 },
		{ name: 'Raigad', value: 0 },
		{ name: 'Ratnagiri', value: 0 },
		{ name: 'Sangli', value: 0 },
		{ name: 'Sindhudurg', value: 0 },
		{ name: 'Solapur', value: 0 },
		{ name: 'Thane', value: 0 },
		{ name: 'Yavatmal', value: 0 },
		{ name: 'Latur', value: 0 },
		{ name: 'Akola', value: 0 },
		{ name: 'Aurangabad', value: 0 },
		{ name: 'Buldhana', value: 0 },
		{ name: 'Chandrapur', value: 0 },
		{ name: 'Gadchiroli', value: 0 },
		{ name: 'Gondia', value: 0 },
		{ name: 'Mumbai Suburban', value: 0 },
		{ name: 'Hingoli', value: 0 },
		{ name: 'Jalna', value: 0 },
		{ name: 'Nagpur', value: 0 },
		{ name: 'Parbhani', value: 0 },
		{ name: 'Satara', value: 0 },
		{ name: 'Wardha', value: 0 },
		{ name: 'Washim', value: 0 },
	]


	yearToRender: number = 0
	allYears: Array<any> = []
	allYearsSet = new Set()
	representationFormat: string = "Geomap"
	startYear: number = 0
	showGeoMap: boolean = false
	value: number = 500000
	mapOption: echarts.EChartsOption = {};
	districtClicked: boolean = false
	districtClickInfoTable: Array<any> = []


	mapFunction() {
		echarts.registerMap('USA', geoJsonData);
		this.mapOption = {
			width: 900,
			height: 600,
			title: {
				text: 'Traffic Intensity Prediction and Recommendation',
				subtext: 'Maharashtra traffic congestion treatment recommendation counts',
				sublink: '',
				left: 'right'
			},
			LayoutSize: 'contain',
			responsive: true,
			maintainAspectRatio: true,
			tooltip: {
				trigger: 'item',
				showDelay: 3,
				transitionDuration: 0.2
			},
			visualMap: {
				left: 'right',
				min: 0,
				max: 5,
				inRange: {
					color: [
						'#ffffff',
						'#ff0000'
					]
				},
				text: ['High', 'Low'],
				calculable: true
			},
			toolbox: {
				show: true,
				//orient: 'vertical',
				left: 'left',
				top: 'top',
				feature: {
					dataView: { readOnly: false },
					restore: {},
					saveAsImage: {}
				}
			},
			series: [
				{
					name: 'Number of treatment recommendations',
					type: 'map',
					roam: true,
					map: 'USA',
					emphasis: {
						label: {
							show: true
						}
					},
					data: this.mapData
				}
			]
		};
	}



	predictionsExist: boolean = true
	starsTableMeaning: Array<any> = [
		// no congestion
		// no treatment needed
		["No congestion", "No Treatment Needed"],
		// congestion level: low (acceptable/tolerable)
		// treatment not recommended
		["Congestion level: Low (acceptable/tolerable)", "Treatment Not Recommended"],
		// congestion level: medium (acceptable/tolerable)
		// attention level for treatment: important
		["Congestion level: Medium (acceptable/tolerable)", "Attention level for treatment: Important"],
		// congestion level: increased (hardly acceptable/tolerable)
		// attention level for treatment: fairly important
		["Congestion level: Increased (hardly acceptable/tolerable)", "Attention level for treatment: Fairly Important"],
		// congestion level: high (unacceptable/intolerable)
		// attention level for treatment: highly important
		["Congestion level: High (unacceptable/intolerable)", "Attention level for treatment: Highly Important"],
		// congestion level: very high (unnacceptable/intolerable)
		// attention level for treatment: extremely important
		["Congestion level: Very High (unnacceptable/intolerable)", "Attention level for treatment: Extremely Important"],
		// congestion level: extreme (unacceptable/intolerable)
		// attention level for treatment: no opinion
		["Congestion level: Extreme (unacceptable/intolerable)", "Attention level for treatment: No Opinion"]

	]
	starsTableDesc: Array<any> = [
		["star", "star_border", "star_border", "star_border", "star_border"],
		["star", "star", "star_border", "star_border", "star_border"],
		["star", "star", "star", "star_border", "star_border"],
		["star", "star", "star", "star_half", "star_border"],
		["star", "star", "star", "star", "star_border"],
		["star", "star", "star", "star", "star_half"],
		["star", "star", "star", "star", "star"],
	]
	importanceLevel: number = 0
	starsIndicationColor: string = ""
	defaultThresholdPercentage: number = 0.7 // 70 percent
	allDistrictsRecommended: Array<any> = []
	relativeChangeArrayMap = new Map()
	alert: string = ""
	toggleWarningToast: boolean = false
	toggleSuccessToast: boolean = false
	errorString: string = ""
	checkRecommendation: boolean = false
	filledStars: Array<string> = []
	halfFilledStars: Array<string> = []
	nonFilledStars: Array<string> = []
	percentageBarColor: ThemePalette = 'primary';
	percentageBarMode: ProgressBarMode = 'determinate';
	percentageBarBufferValue = 75;
	percentageCrossedThresholdValue: number = 0
	percentageOfVehiclesCrossedTrendLimit: number = 0
	relativeChangeFactor: string = ""
	factorsForRelativeChange: Array<string> = ['Mean (Average)', 'Mode', 'Median', 'First Prediction Instance', 'Last pcu observation']
	allRelativeChanges: any
	relativeChange: number = 0
	countVehiclesCrossedRelativeTrend: number = 0
	showWhenFirstRecommendation: boolean = true
	relativeChangeArray: Array<number> = []
	firstDayOfTreatment: number = 0
	countNumberOfDaysBeforeFirstTreatment: number = 0
	firstTreatmentRecommendationTime: string = ""
	firstTreatmentRecommendationVehicles: number = 0
	showBy: string = ""
	showByArray: Array<string> = []
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



	openRatingInfoDialog() {
		this.dialog.open(RatingInfoComponent)
	}

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


	plotFuturePredictions(x: any, y: any, z: any, r: any) {
		// prediction is done

		// this.mapOptionFuturePredictions = {
		// 	tooltip: {
		// 		trigger: 'axis'
		// 	},
		// 	legend: {
		// 		data: ['Predicted', 'Max capacity', 'Threshold capacity']
		// 	},
		// 	xAxis: {
		// 		data: x
		// 	},
		// 	yAxis: {},
		// 	series: [
		// 		{
		// 			name: 'Predicted',
		// 			data: y,
		// 			type: 'line',
		// 			symbol: 'none',
		// 			lineStyle: {
		// 				color: 'blue',
		// 			}
		// 		},
		// 		{
		// 			name: 'Max capacity',
		// 			data: z,
		// 			type: 'line',
		// 			symbol: 'none',
		// 			lineStyle: {
		// 				color: '#000000',
		// 				type: 'dotted'
		// 			}
		// 		},
		// 		{
		// 			name: 'Threshold capacity',
		// 			data: r,
		// 			type: 'line',
		// 			symbol: 'none',
		// 			lineStyle: {
		// 				color: '#FF0000',
		// 				type: 'dashed'
		// 			}
		// 		}
		// 	]
		// 	// title: {
		// 	// 	text: 'Stacked Line'
		// 	// },
		// 	// tooltip: {
		// 	// 	trigger: 'axis'
		// 	// },
		// 	// legend: {
		// 	// 	data: ['']
		// 	// },
		// 	// grid: {
		// 	// 	left: '3%',
		// 	// 	right: '4%',
		// 	// 	bottom: '3%',
		// 	// 	containLabel: true
		// 	// },
		// 	// toolbox: {
		// 	// 	feature: {
		// 	// 		saveAsImage: {}
		// 	// 	}
		// 	// },
		// 	// xAxis: {
		// 	// 	type: 'category',
		// 	// 	boundaryGap: false,
		// 	// 	data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		// 	// },
		// 	// yAxis: {
		// 	// 	type: 'value'
		// 	// },
		// 	// series: [
		// 	// 	{
		// 	// 		name: 'Email',
		// 	// 		type: 'line',
		// 	// 		//   stack: 'Total',
		// 	// 		data: [120, 132, 101, 134, 90, 230, 210]
		// 	// 	},
		// 	// 	{
		// 	// 		name: 'Union Ads',
		// 	// 		type: 'line',
		// 	// 		//   stack: 'Total',
		// 	// 		data: [220, 182, 191, 234, 290, 330, 310]
		// 	// 	},
		// 	// 	{
		// 	// 		name: 'Video Ads',
		// 	// 		type: 'line',
		// 	// 		//   stack: 'Total',
		// 	// 		data: [150, 232, 201, 154, 190, 330, 410]
		// 	// 	},
		// 	// 	{
		// 	// 		name: 'Direct',
		// 	// 		type: 'line',
		// 	// 		//   stack: 'Total',
		// 	// 		data: [320, 332, 301, 334, 390, 330, 320]
		// 	// 	},
		// 	// 	{
		// 	// 		name: 'Search Engine',
		// 	// 		type: 'line',
		// 	// 		//   stack: 'Total',
		// 	// 		data: [820, 932, 901, 934, 1290, 1330, 1320]
		// 	// 	}
		// 	// ]
		// }
		let max = (z[0] > Math.max(...y))? z[0] : Math.max(...y)

		this.mapOptionFuturePredictions = {
			title: {
				text: 'Predictions',
				left: '1%'
			},
			tooltip: {
				trigger: 'axis'
			},
			grid: {
				left: '5%',
				right: '15%',
				bottom: '10%'
			},
			xAxis: {
				data: x
			},
			yAxis: {
				max: max
			},
			toolbox: {
				right: 10,
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					restore: {},
					saveAsImage: {}
				}
			},
			dataZoom: [
				{
					startValue: '2018-01-01'
				},
				{
					type: 'inside'
				}
			],
			visualMap: {
				top: 50,
				right: 10,
				pieces: [
					{
						gt: r[0],
						lte: z[0],
						color: 'black'
					},
					{
						gt: z[0],
						color: 'red'
					}
				],
				outOfRange: {
					color: '#999'
				}
			},
			series: {
				name: 'Predicted',
				type: 'line',
				data: y,
				markLine: {
					silent: false,
					lineStyle: {
						color: '#333'
					},
					data: [
						{
							yAxis: r[0]
						},
						{
							yAxis: z[0]
						},
					]
				}
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



	async getRoadwayWidthMaxVehiclesMaps() {
		return new Promise<void>((resolve, reject) => {
			this.junctionSpecificsService.getAllRoadwayWidthMaxVehiclesMaps().subscribe({
				next: (response) => {
					for (const element of Object.values(response)) {
						this.roadwayWidthMaxVehiclesMaps.set(element['roadwayWidth'], element['maxVehicles'])
					}

					this.currentDistrict = this.junctionDistrictMaps.get(this.junctionChoice)!
					this.currentRoadwayWidth = parseInt(this.junctionRoadwayWidthMaps.get(this.junctionChoice)!)
					this.currentMaxVehicles = this.roadwayWidthMaxVehiclesMaps.get(this.currentRoadwayWidth)!


					if (response != '') {
						this.junctionSpecificDetailsProvided = true
					}
					resolve()
				},
				error: (error: HttpErrorResponse) => {
					reject()
				}
			})
		})
	}


	async getJunctionRoadwayWidthMaps() {
		return new Promise<void>((resolve, reject) => {
			this.junctionSpecificsService.getAllJunctionRoadwayWidthMaps().subscribe({
				next: (response) => {
					for (const element of Object.values(response)) {
						this.junctionRoadwayWidthMaps.set(element['junctionName'], element['roadwayWidth'])
					}

					if (response != '') {
						resolve()
					}
				},
				error: (error: HttpErrorResponse) => {
					reject()
				}
			})
		})
	}



	async getJunctionDistrictMaps() {
		return new Promise<void>((resolve, reject) => {
			this.junctionSpecificsService.getAllJunctionDistrictMaps().subscribe({
				next: (response) => {
					for (const element of Object.values(response)) {
						this.junctionDistrictMaps.set(element['junctionName'], element['district'])
					}

					if (response != '') {
						resolve()
					}
				},
				error: (error: HttpErrorResponse) => {
					reject()
				}
			})

		})

	}


	async getAllJunctionSpecificDataFromDB() {
		return new Promise<void>((resolve, reject) => {
			this.getJunctionDistrictMaps().then(() => {
				this.getJunctionRoadwayWidthMaps().then(() => {
					this.getRoadwayWidthMaxVehiclesMaps().then(() => {
						resolve()
					})
				})
			})
		})
	}


	async convertDateTimeToBePlotted(dateTimeToBePlotted: Array<string>) {
		return new Promise<Array<string>>((resolve, reject) => {
			let newDateTimeToBePlotted: Array<string> = []
			if (this.showBy == 'Years') {
				for (let element of dateTimeToBePlotted) {
					newDateTimeToBePlotted.push(element.slice(0, 4))
				}
				resolve(newDateTimeToBePlotted)
			} else if (this.showBy != 'Years' && this.showBy != 'Hours') {
				for (let element of dateTimeToBePlotted) {
					newDateTimeToBePlotted.push(element.slice(0, 10))
				}
				resolve(newDateTimeToBePlotted)
			}
		})
	}



	getPercentageOfTimesCrossed(thresholdValue: number) {
		let count: number = 0
		for (let element of this.vehiclesToBePlotted) {
			if (element > thresholdValue) {
				count++
			}
		}
		let percentage: number = 0
		percentage = (count / this.vehiclesToBePlotted.length) * 100
		return percentage
	}

	rateStars(percentage: number) {
		if (percentage <= 20) {
			this.filledStars = new Array(1).fill("star")
			this.nonFilledStars = new Array(4).fill("star_border")
			this.halfFilledStars = []
			this.starsIndicationColor = "primary"
			this.importanceLevel = 0
			this.ratingOutOfFive = 1

			// no congestion
			// no treatment needed


		} else if (percentage <= 40) {
			this.filledStars = new Array(2).fill("star")
			this.nonFilledStars = new Array(3).fill("star_border")
			this.halfFilledStars = []
			this.starsIndicationColor = "primary"
			this.importanceLevel = 1
			this.ratingOutOfFive = 2

			// congestion level: low (acceptable/tolerable)
			// treatment not recommended


		} else if (percentage <= 60) {
			this.filledStars = new Array(3).fill("star")
			this.nonFilledStars = new Array(2).fill("star_border")
			this.halfFilledStars = []
			this.starsIndicationColor = "accent"
			this.importanceLevel = 2
			this.ratingOutOfFive = 3
			// congestion level: medium (acceptable/tolerable)
			// attention level for treatment: important


		} else if (percentage <= 70) {
			this.filledStars = new Array(3).fill("star")
			this.halfFilledStars = new Array(1).fill("star_half")
			this.nonFilledStars = ["star_border"]
			this.starsIndicationColor = "accent"
			this.importanceLevel = 3
			this.ratingOutOfFive = 3.5

			// congestion level: increased (hardly acceptable/tolerable)
			// attention level for treatment: fairly important

		} else if (percentage <= 80) {
			this.filledStars = new Array(4).fill("star")
			this.nonFilledStars = new Array(1).fill("star_border")
			this.halfFilledStars = []
			this.starsIndicationColor = "warn"
			this.importanceLevel = 4
			this.ratingOutOfFive = 4

			// congestion level: high (unacceptable/intolerable)
			// attention level for treatment: highly important

		} else if (percentage <= 90) {
			this.filledStars = new Array(4).fill("star")
			this.halfFilledStars = new Array(1).fill("star_half")
			this.nonFilledStars = []
			this.starsIndicationColor = "warn"
			this.importanceLevel = 5
			this.ratingOutOfFive = 4.5

			// congestion level: very high (unnacceptable/intolerable)
			// attention level for treatment: extremely important

		} else if (percentage > 90) {
			this.filledStars = new Array(5).fill("star")
			this.nonFilledStars = []
			this.halfFilledStars = []
			this.starsIndicationColor = "warn"
			this.importanceLevel = 6
			this.ratingOutOfFive = 5

			// congestion level: extreme (unacceptable/intolerable)
			// attention level for treatment: no opinion

		}
	}



	renderPredictions() {
		this.numberOfTimesCrossedMaxCapacity = 0
		this.countVehiclesCrossedRelativeTrend = 0
		this.currentDistrict = this.junctionDistrictMaps.get(this.junctionChoice)!
		this.currentRoadwayWidth = parseInt(this.junctionRoadwayWidthMaps.get(this.junctionChoice)!)
		this.currentMaxVehicles = this.roadwayWidthMaxVehiclesMaps.get(this.currentRoadwayWidth)!
		this.currentJunctionsPredictedData = this.allJunctionsPredictedData[this.junctionChoice]
		this.numberOfRecordsResult = this.currentJunctionsPredictedData.length
		this.dataSourceResult = this.currentJunctionsPredictedData.slice(this.indexResult, this.indexResult + 10)
		this.currentJunctionPlotData = this.allJunctionsPlotData[this.junctionChoice]

		this.setVehiclesAndDateTime(
			this.currentJunctionPlotData[0]['vehicles'],
			this.currentJunctionPlotData[0]['datetime']
		)


		this.maxVehicles = Array(this.dateTimeToBePlotted.length).fill(this.currentMaxVehicles)

		let thresholdValue: number = 0

		thresholdValue = this.currentMaxVehicles * this.defaultThresholdPercentage
		let thresholdLine = Array(this.dateTimeToBePlotted.length).fill(thresholdValue)

		this.convertDateTimeToBePlotted(this.dateTimeToBePlotted).then((result) => {
			this.dateTimeToBePlotted = result
			this.plotFuturePredictions(
				this.dateTimeToBePlotted,
				this.vehiclesToBePlotted,
				this.maxVehicles,
				thresholdLine
			)
		})


		this.percentageCrossedThresholdValue = this.getPercentageOfTimesCrossed(thresholdValue)
		this.rateStars(this.percentageCrossedThresholdValue)


		for (let i = 0; i < this.relativeChangeArray.length; i++) {
			if (this.vehiclesToBePlotted[i] > this.relativeChangeArray[i]) {
				this.countVehiclesCrossedRelativeTrend++
			}
		}

		this.firstTreatmentRecommendationTime = ""
		this.firstTreatmentRecommendationVehicles = 0
		this.countNumberOfDaysBeforeFirstTreatment = 0
		for (let i = 0; i < this.vehiclesToBePlotted.length; i++) {
			this.countNumberOfDaysBeforeFirstTreatment++
			if (this.vehiclesToBePlotted[i] > this.currentMaxVehicles) {
				this.firstTreatmentRecommendationTime = this.dateTimeToBePlotted[i]
				this.firstTreatmentRecommendationVehicles = this.vehiclesToBePlotted[i]
				break;
			}
		}

		if (this.countNumberOfDaysBeforeFirstTreatment == this.dateTimeToBePlotted.length) {
			this.showWhenFirstRecommendation = false
		}


		for (let element of this.vehiclesToBePlotted) {
			if (element > this.currentMaxVehicles) {
				this.numberOfTimesCrossedMaxCapacity++
			}
		}
		if (this.numberOfTimesCrossedMaxCapacity === 0) {
			this.showMaxCapacity = false
		} else {
			this.showMaxCapacity = true
		}

	}


	async getStartYearMap() {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.getStartYearMap().subscribe({
				next: (response) => {
					for (let i = 0; i < Object.keys(response).length; i++) {
						this.startYear = (this.junctionChoice == Object.keys(response)[i]) ? Object.values(response)[i] : this.startYear;
					}
					resolve()
				},
				error: (error: HttpErrorResponse) => {
				}
			})
		})
	}

	async getMasterDataAccuracies() {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.getMasterTrainedJunctionsAccuracies().subscribe({
				next: (response) => {
					this.junctionComparisonData = response
					resolve()
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
					reject()
				}
			})
		})
	}


	async getMasterDataTable() {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.getMasterTrainedDataForTable().subscribe({
				next: (response) => {
					this.resultTableReady = true
					this.allJunctionsPredictedData = response
					this.predictionsReady = true
					resolve()
				},
				error: (error: HttpErrorResponse) => {
					reject()
				}
			})
		})
	}

	async getMasterDataPlot() {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.getMasterTrainedDataPlot().subscribe({
				next: (response) => {

					if (Object.values(response).length == 0) {
						this.predictionsExist = false
						resolve()
					} else {
						this.predictionsExist = true
					}


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
					resolve()


				},
				error: (error: HttpErrorResponse) => {
					reject()
				}
			})
		})
	}



	async getMasterData() {
		return new Promise<void>((resolve, reject) => {
			this.getMasterDataPlot().then(() => {
				this.getMasterDataTable().then(() => {
					this.getMasterDataAccuracies().then(() => {
						this.getStartYearMap().then(() => {
							resolve()
						})
					})
				})
			})
		})
	}


	async renderAll() {
		return new Promise<void>((resolve, reject) => {
			this.renderPredictions()
			this.renderJunctionAccuracyPie()
			resolve()
		})
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



	async getAllDistrictTreatmentCounts() {
		return new Promise<void>((resolve, reject) => {
			this.districtTreatmentCountService.getAllDistrictTreatmentCounts().subscribe({
				next: (response) => {
					this.allDistrictsRecommended = Object.values(response)
					for (let element of this.allDistrictsRecommended) {
						this.allYearsSet.add(element.startYear)
					}
					this.allYears = Array.from(this.allYearsSet.values())
					if (this.allYears.length > 0) {
						this.yearToRender = this.allYears[0]
					}
					resolve()
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
					reject()
				}
			})
		})
	}

	predict() {
		this.predictionsReady = false
		this.checkRecommendation = false

		let timeToBePredicted: object = {
			timePeriod: this.duration,
			timeFormat: this.time,
			showBy: this.showBy
		}
		this.flaskService.sendInputTimeToPredict(timeToBePredicted).subscribe({
			next: (response) => {
				this.getMasterData().then(() => {
					if (!this.predictionsExist) {
						alert("Note: Entries not found. Please try signing in again after some time")
					} else {
						this.setAccuracyComparisonTableData().then(() => {
							this.renderAll().then(() => {
								this.getAllDistrictTreatmentCounts().then(() => {
									this.checkIfAlreadyRecommended()
									this.changeYearToRender().then(() => {
										this.mapFunction()
									})
								})
							})
						})
					}

				})
			},
			error: (error: HttpErrorResponse) => {
				alert(error.message)
			}
		})
	}





	renderJunctionAccuracyPie() {
		this.mapOptionAccuracyPie = {
			title: {
				text: 'Accuracy and Inaccuracy of predictions',
				subtext: this.junctionChoice,
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				left: 'left'
			},
			series: [
				{
					name: 'Access From',
					type: 'pie',
					radius: '50%',
					data: [
						{ value: this.junctionComparisonData[this.currentPie], name: 'accuracy' },
						{ value: 1 - this.junctionComparisonData[this.currentPie], name: 'inaccuracy' },
					],
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		}
	}

	async changeShowByArray() {
		return new Promise<void>((resolve, reject) => {
			if (this.time == 'Years') {
				this.showByArray = ['Weeks', 'Months']
				this.showBy = 'Weeks'
			}
			resolve()
		})
	}

	// on clicking download predictions button option, download the data into a csv file
	downloadPredictions() {


		let dataToDownload: Array<Object> = []
		for (let element of this.currentJunctionsPredictedData) {
			let datetime: string = ""
			if (this.showBy == 'Years') {
				datetime = element.DateTime.slice(0, 4)
			}
			if (this.showBy != 'Years' && this.showBy != 'Hours') {
				datetime = element.DateTime.slice(0, 10)
			}
			let record: Object = {
				'DateTime': datetime,
				'Pcu': element.Pcu,
				'Junction': this.junctionChoice
			}
			dataToDownload.push(record)
		}


		const options = {
			fieldSeparator: ',',
			quoteStrings: '',
			decimalseparator: '.',
			showLabels: true,
			useBom: true,
			noDownload: false,
			headers: ['DateTime', 'Pcu', 'Junction']
		};
		try {
			new ngxCsv(dataToDownload, "result_" + this.junctionChoice + "_" + this.duration + "_" + this.time, options);
		} catch (error) {
			alert(error)
		}
	}

	async storeRecommendation() {
		return new Promise<void>((resolve, reject) => {
			let recommended: Object = {
				junctionName: this.junctionChoice,
				districtName: this.currentDistrict,
				startYear: this.startYear,
				durationYears: 2
			}
			this.recommendedService.storeRecommendation(recommended).subscribe({
				next: (response) => {
					resolve()
				},
				error: (error: HttpErrorResponse) => {
					reject()
				}
			})

		})
	}

	async checkIfAlreadyRecommended() {
		return new Promise<string>((resolve, reject) => {
			this.recommendedService.checkIfAlreadyRecommended(this.junctionChoice, this.startYear).subscribe({
				next: (response) => {
					if (!response) {
						resolve("not recommended")
						this.alert = "danger"
						this.alreadyRecommended = false
					} else {
						resolve("already recommended")
						this.alert = "success"
						this.alreadyRecommended = true
					}
				},
				error: (error: HttpErrorResponse) => {
					reject()
				}
			})
		})
	}

	increaseDistrictTreatmentCount() {
		this.districtTreatmentCountService.increaseDistrictTreatmentCount(this.currentDistrict, this.startYear, 2).subscribe({
			next: (response) => {
			},
			error: (error: HttpErrorResponse) => {
			}
		})
	}


	dequeueRecommendation() {
		this.recommendedService.deleteRecommendation(this.junctionChoice, this.currentDistrict, this.startYear, 2).subscribe({
			next: (response) => {
				this.districtTreatmentCountService.decreaseDistrictTreatmentCount(this.currentDistrict, this.startYear, 2).subscribe({
					next: (response) => {
						this._snackbar.open('Note: Recommendation dequeued for ' + this.junctionChoice, '\u2716', {
							duration: 3000
						})
						this.checkIfAlreadyRecommended().then((status: string) => {
							this.getAllDistrictTreatmentCounts().then(() => {
								this.changeYearToRender().then(() => {
									this.mapFunction()
								})
							})
						})
					},
					error: (error: HttpErrorResponse) => {
					}
				})
			},
			error: (error: HttpErrorResponse) => {
			}
		})

	}


	async addRecommendation() {
		return new Promise<void>((resolve, reject) => {
			if (this.checkRecommendation) {
				this.checkIfAlreadyRecommended().then((status: string) => {
					if (status == "not recommended") {
						this.storeRecommendation().then(() => {
							this.increaseDistrictTreatmentCount()
							this.checkIfAlreadyRecommended().then((status: string) => {
								resolve()
							})
						})
						this.toggleSuccessToast = true
						this.errorString = 'Note: Recommendation Enqueued for ' + this.junctionChoice
						setTimeout(() => {
							this.toggleSuccessToast = false
						}, 3000);
						this._snackbar.open('Recommendation Enqueued', '\u2716', {
							duration: 3000
						})
					} else {
						this._snackbar.open('Already recommended (Not enqueued)', '\u2716', {
							duration: 3000
						})
						reject()
					}
				})
			}
		})
	}


	enqueueRecommendation() {
		this.addRecommendation().then(() => {
			this.getAllDistrictTreatmentCounts().then(() => {
				this.changeYearToRender().then(() => {
					this.mapFunction()
				})
			})
		})
	}



	changeRepresentationFormat() {
		this.showGeoMap = (this.representationFormat == 'Geomap') ? false : true;
		if (this.showGeoMap) {
			this.mapFunction()
		}
	}

	setMapData() {
		for (let element of this.allDistrictsRecommended) {
			if (element.startYear == this.yearToRender) {
				for (let districtInstance of this.mapData) {
					if (districtInstance.name == element.districtName) {
						districtInstance.value = element.numberOfTreatmentRecommendations
					}
				}
			}
		}
	}

	async changeYearToRender() {
		return new Promise<void>((resolve, reject) => {

			for (let i of this.mapData) {
				i.value = 0
			}

			if (this.allDistrictsRecommended.length > 0) {
				this.setMapData()
			}
			resolve()
		})
	}

	onChartClick(event: any) {
		this.districtClicked = true
		this.recommendedService.getDistrictInstancesWithStartYear(event.name, this.startYear).subscribe({
			next: (response) => {
				this.districtClickInfoTable = Object.values(response)
			},
			error: (error: HttpErrorResponse) => {
			}
		})
	}


	ngOnInit() {

		this.relativeChangeFactor = this.factorsForRelativeChange[3]


		this.getAllJunctionSpecificDataFromDB().then(() => {
			this.duration = 2
			this.time = 'Years'
			this.changeShowByArray().then(() => {
				this.predict()
			})
		})

	}
}