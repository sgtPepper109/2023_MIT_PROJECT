import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PropService } from '../services/propService/prop.service';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { FlaskService } from '../services/flaskService/flask.service';
import { JunctionSpecificsService } from '../services/db/junctionSpecifics/junction-specifics.service';
import { ngxCsv } from 'ngx-csv';
import { SampleCsvData } from 'src/assets/sample';
import { HourlySampleData } from 'src/assets/hourly_sample';
import { DailySampleData } from 'src/assets/daily_sample';
import { tableRecord, csvInstance, csvParseRecord } from '../interfaces/all-interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as echarts from 'echarts';
import { MatDialog } from '@angular/material/dialog';
import { DatasetDescriptionComponent } from '../dialogs/dataset-description/dataset-description.component';
import { ModelSummaryComponent } from '../dialogs/model-summary/model-summary.component';
import { AddToMasterDialogComponent } from '../dialogs/add-to-master-dialog/add-to-master-dialog.component';
import { ClearAppendDialogComponent } from '../dialogs/clear-append-dialog/clear-append-dialog.component';


@Component({
	selector: 'app-training',
	templateUrl: './training.component.html',
	styleUrls: ['./training.component.css']
})

export class TrainingComponent implements OnInit {
	constructor(
		private sampleCsv: SampleCsvData,
		private hourlyData: HourlySampleData,
		private dailyData: DailySampleData,
		private router: Router,
		private propService: PropService,
		private ngxCsvParser: NgxCsvParser,
		private flaskService: FlaskService,
		private junctionSpecificsService: JunctionSpecificsService,
		private _snackBar: MatSnackBar,
		public dialog: MatDialog
	) { }


	tabIndex: number = 0
	manageTrainingTabDisabled: boolean = false
	trainingSummaryTabDisabled: boolean = false
	predictionsTabDisabled: boolean = false
	visualizationTabDisabled: boolean = false
	csv: any
	clearProgress: boolean = false
	mapOptionDataVisualization: echarts.EChartsOption = {}
	mapOptionActualVsPredicted: echarts.EChartsOption = {}
	mapOptionAlgorithmComparison: echarts.EChartsOption = {}
	mapOptionTestingRatiosComparison: echarts.EChartsOption = {}
	mapOptionUltimateComparison: echarts.EChartsOption = {}
	ultimateChartLegendsData: Array<string> = []
	mapOptionFuturePredictions: echarts.EChartsOption = {}
	actualVsPredictedCardHidden: boolean = true
	algorithmComparisonCardHidden: boolean = true
	testingRatioComparisonCardHidden: boolean = true
	addedToMaster: boolean = false
	masterAddedJunctions: Array<string> = []
	addToMasterStatus: string = "success"
	trained: boolean = false
	showActualVsPredInfo: boolean = false
	showAccuracyComparisons: boolean = false
	showAccuracyComparisonsTestingRatios: boolean = false
	footerOn: boolean = false
	// treeData: Array<treeInstance> = []
	testRatioComparisonChartHidden: boolean = false;
	testRatioComparisonTableData: Array<any> = []
	accuracyOptionAlgorithm: string = "Line Plot"
	datasetHasImproperValues: boolean = false
	existingActive: boolean = false
	predictionsActive: boolean = false
	manageTrainingActive: boolean = true
	trainingSummaryActive: boolean = false
	currentNav: string = "manageTraining"
	showFiller: boolean = false
	startYear: number = 0
	endYear: number = 0
	temp: any
	temp2: any
	datasetDescriptionIcon = "speaker_notes_off"
	trainingAction: string = ""
	showTrainingOptions: boolean = false
	junctionsAlreadyTrained = new Set<string>();
	csvParsedData: any
	ultimateData: Array<any> = []
	algorithms: Array<string> = []
	relativeChange: string = ""
	highestAccuracy: number = 0
	showBy: string = ""
	showByArray: Array<string> = []
	errorString: string = ""
	toggleSuccessToast: boolean = false
	toggleWarningToast: boolean = false
	inputJunctionDisabled: boolean = true
	sampleCsvTableDaily: Array<any> = this.sampleCsv.sampleCsvDataDaily
	sampleCsvTableHourly: Array<any> = this.sampleCsv.sampleCsvDataHourly
	testRatioComparisonChartTestRatiosAxis: Array<string> = []
	testRatioComparisonChartAccuraciesAxis: Array<number> = []
	accuracyBarChartAlgorithmsAxis: Array<string> = []
	accuracyBarChartAccuraciesAxis: Array<number> = []
	allModelSummaries: Object = {}
	allActualVsPredicedComparisonTableData: Object = {}
	actualVsPredictedComparisonTableData: any
	actualVsPredictedComparisonPlotData: Object = {}
	allActualVsPredictedComparisonPlotData: Object = {}
	renderedTestRatio: string = ""
	testRatioHighestAccuracy: number = 0
	algorithmHighestAccuracy: string = ""
	testingRatios: Array<number> = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
	resultTestingRatios: Array<string> = []
	ultimateComparisonChartFormat: string = "Bar Chart"
	algorithmToAddToMaster: string = ""
	testRatioToAddToMaster: string = ""
	ultimateComparisonChart: any
	testRatiosComparisonData: Object = {}
	algorithmForComparison: string = ""
	gotTestingRatioComparisons: boolean = false
	testRatioComparisonChart: any
	testingRatioComparisonChartNotReady: boolean = true
	actualPredictedTableData: Object = {}
	actualPredictedPlotData: Object = {}
	modelSummaries: Object = {}
	renderedAlgorithm: string = ""
	correctJunctions: boolean = true
	listedJunctions: Array<string> = []
	plotActual: Array<number> = []
	plotPredicted: Array<number> = []
	plotDifference: Array<number> = []
	plotLabels: Array<string> = []
	uniqueJunctionsInDataset: Array<string> = []
	file: any
	junctionSpecificDataAvailable: boolean = false;
	fileProcessing: boolean = false
	datasetUploaded: boolean = false
	modelSummaryReady: boolean = false
	futurePredictionsPlotData: any
	futurePredictionsTableData: any
	csvDataStored: boolean = false;
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
	accuracies: Array<tableRecord> = []
	csvRecords: object = {}
	datasetPath: string = ""
	recievedPlotData: any
	vehicles: Array<any> = []  // Vehicles array to display on y axis of chart
	datetime: Array<any> = [] // DateTime array to display on x axis of chart
	inputJunction: string = ""// input variables for junction and months
	inputAlgorithm: string = "Random Forest Regression"
	time: number = 0
	timeFormat: string = ""
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
	csvData: Array<csvInstance> = []

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
	labels: Array<string> = []
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
				this.listedJunctions = Object.values(response)
				this.junctions = this.listedJunctions
				this.inputJunction = this.junctions[0]

				this.flaskService.getAllAlgorithms().subscribe({
					next: (response) => {
						this.algorithms = Object.values(response)
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
	}

	openAddToMasterDialog() {
		let dialogRef = this.dialog.open(AddToMasterDialogComponent, {
			data: {
				junction: this.inputJunction,
				algorithmToAddToMaster: this.algorithmToAddToMaster,
				testRatioToAddToMaster: this.testRatioToAddToMaster,
				accuracy: this.modelSummary[3].Value,
				startYear: this.startYear
			}
		})

		dialogRef.afterClosed().subscribe(result => {
			this.checkIfAddedToMaster()
		})

	}

	openModelSummaryDialog() {
		this.dialog.open(ModelSummaryComponent, {
			data: {
				modelSummaryReady: this.modelSummaryReady,
				modelSummary: this.modelSummary
			}
		})
	}

	openDatasetDescriptionDialog() {
		this.dialog.open(DatasetDescriptionComponent);
	}

	changeUltimateComparisonFormat() {
		if (this.ultimateComparisonChartFormat == 'Line Plot') {
			for (let element of this.ultimateData) {
				if (element.type == 'bar')
					element.type = 'line'
			}
		} else {
			for (let element of this.ultimateData) {
				if (element.type == 'line' && element.name !='Max Accuracy')
					element.type = 'bar'
			}
		}


		this.mapOptionUltimateComparison = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: this.ultimateChartLegendsData
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				name: 'Testing ratios and algorithms',
				nameLocation: 'middle',
				nameGap: 20,
				axisTick: { show: false },
				data: Object.keys(Object.values(this.testRatiosComparisonData)[1])
			},
			yAxis: {
				type: 'value',
				name: 'Accuracy',
				nameLocation: 'middle',
				nameGap: 50,
				boundaryGap: [0, 0.01]

			},
			series: this.ultimateData
		}
	}


	setVehiclesAndDateTime(param1: any, param2: any) {
		this.vehiclesToBePlotted = param1
		this.dateTimeToBePlotted = param2
	}
	plotFuturePredictions(z: any, x: any, y: any) {
		// prediction is done
		this.futurePredictionsChartHidden = false

		let max = (z[0] > Math.max(...y)) ? z[0] : Math.max(...y)

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
				data: x,
				name: 'Date-Time',
				nameLocation: 'middle',
				nameGap: 20
			},
			yAxis: {
				max: max,
				nameLocation: 'middle',
				name: 'Predicted PCU',
				nameGap: 50
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
						gt: z[0],
						lte: 100,
						color: '#FD0100'
					},
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
							yAxis: z[0]
						},
					]
				}
			}
		}
	}






	downloadSample(sampleType: string) {
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
			if (sampleType == 'Hourly') {
				new ngxCsv(this.hourlyData.HourlySampleData, "sample_hourly", options);
			} else {
				new ngxCsv(this.dailyData.DailySampleData, "sample_daily", options);
			}
		} catch (error) {
			alert(error)
		}

	}


	checkIfAddedToMaster() {
		this.flaskService.getMasterTrainedDataPlot().subscribe({
			next: (response) => {
				this.masterAddedJunctions = Object.keys(response)
				if (this.masterAddedJunctions.includes(this.inputJunction)) {
					this.addToMasterStatus = "success"
					this.addedToMaster = true
				} else {
					this.addToMasterStatus = "danger"
					this.addedToMaster = false
				}
			},
			error: (error: HttpErrorResponse) => {
				alert(error.message)
			}
		})
	}

	processAndStartTraining() {

		let dialogRef = this.dialog.open(ClearAppendDialogComponent, {
			data: {
				junction: this.inputJunction,
				alreadyTrained: this.junctionsAlreadyTrained.has(this.inputJunction),
				action: this.clearProgress? 'clear': 'append',
				finalizedAction: false
			}
		})
		dialogRef.afterClosed().subscribe(result => {
			if (result.finalizedAction) {
				if (!this.showTrainingOptions) {
					this.startTraining('clear').then((status: string) => {
						if (status == 'success')
							this.checkIfAddedToMaster()
					})
				} else {
					if (this.clearProgress) {
						this.startTraining('clear').then((status: string) => {
							if (status == 'success')
								this.checkIfAddedToMaster()
						})
					}
					else {
						this.startTraining('append').then((status: string) => {
							if (status == 'success')
								this.checkIfAddedToMaster()
						})
					}
				}
			}
		})

	}

	checkJunction() {
		this.flaskService.checkIfTrained(this.inputJunction).subscribe({
			next: (response) => {
				if (Object.values(response)[0]) {
					this.showTrainingOptions = true
					this.clearProgress = true
				}
				if (!Object.values(response)[0]) {
					this.showTrainingOptions = false
				}
			},
			error: (error: HttpErrorResponse) => {
			}
		})
	}


	isInteger(value: string) {
		return /^\d+$/.test(value);
	}


	async validateCsv(result: Array<csvParseRecord>) {
		return new Promise<void>((resolve, reject) => {
			for (const element of Object.values(result)) {
				if (element.Junction != '' && element.DateTime != '' && element.Pcu != '') {
					if (!this.uniqueJunctionsInDataset.includes(element.Junction) && element.Junction != "") {
						this.uniqueJunctionsInDataset.push(element.Junction)
					}
					if (!this.isInteger(element.Pcu)) {
						this.datasetHasImproperValues = true
					}
				} else {
					this.datasetHasImproperValues = true
				}
			}

			if (this.uniqueJunctionsInDataset.length == 1 && this.inputJunction == this.uniqueJunctionsInDataset[0]) {
				this.correctJunctions = true
			} else {
				this.correctJunctions = false
			}
			resolve()
		})
	}

	async parseCsv(files: any) {
		return new Promise<Array<csvParseRecord>>((resolve, reject) => {
			let header: boolean = true
			header = (header as unknown as string) === 'true' || header === true;
			this.ngxCsvParser.parse(files[0], { header: header, delimiter: ',', encoding: 'utf8' }).pipe().subscribe({
				next: (result): void => {
					this.csv = result
					this.csvParsedData = result
					this.correctJunctions = true
					this.uniqueJunctionsInDataset = []
					resolve(result as Array<csvParseRecord>)

				},
				error: (error: NgxCSVParserError): void => {
					reject()
					alert(error.message)
				}
			});
		})
	}


	async sendCsvData() {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.sendCsvData(this.csv).subscribe({
				next: (response) => {
					let responseString = Object.values(response)[0]
					if (responseString != "success") {
						this.dataset = ""
						this.fileProcessing = false
						this._snackBar.open('Note: ' + responseString, '\u2716', {
							horizontalPosition: 'right',
							verticalPosition: 'bottom',
							duration: 3000
						})
					} else {
						this.datasetHasImproperValues = false
						this.csvDataParsed = true
						this.datasetUploaded = true
						this.fileProcessing = false
						this.getExistingData()
					}
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
				}
			})
		})
	}


	fileChangeListener($event: any): void {
		this.fileProcessing = true
		const files: any = $event.srcElement.files;
		let fileName = files[0]['name']

		const arr = fileName.split('.')
		if (arr[arr.length - 1] === 'csv') {
			this.parseCsv(files).then((result) => {
				this.validateCsv(result).then(() => {
					if (!this.datasetHasImproperValues && this.correctJunctions) {
						for (let instance of Object.values(result)) {
							let csvRecord: csvInstance = {
								dateTime: instance['DateTime'].toString(),
								junction: instance['Junction'],
								pcu: parseInt(instance['Pcu'])
							}
							this.csvData.push(csvRecord)
						}

						this.checkJunction()
						this.sendCsvData()
						this.existingActive = true
					} else {
						this.dataset = ""
						this.fileProcessing = false
						this._snackBar.open('Note: Invalid dataset. Please provide correct dataset', '\u2716', {
							horizontalPosition: 'right',
							verticalPosition: 'bottom',
							duration: 3000
						})
					}
				})
			})
		} else {
			this.dataset = ""
			this.fileProcessing = false
			this._snackBar.open("Note: Incorrect file type (Please choose a .csv file", '', {
				horizontalPosition: 'right',
				verticalPosition: 'bottom'
			})
		}
	}

	changeTrain() {
		if (parseFloat(this.inputTestRatio) < 0) {
			this.inputTestRatio = "0"
			this._snackBar.open("Note: ratio cannot be a negative value", '', {
				horizontalPosition: 'right',
				verticalPosition: 'bottom'
			})
		} else {
			this.toggleErrorString = false
			this.inputTrainRatio = (1 - parseFloat(this.inputTestRatio)).toString()
		}
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
		this.maxLimitArray = new Array(this.datetime.length).fill(this.maxVehicles)
		this.LineChart(this.datetime, this.vehicles)
	}

	LineChart(x: any, y: any) {
		this.mapOptionDataVisualization = {
			tooltip: {
				trigger: 'axis'
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: x,
				nameLocation: 'middle',
				name: 'Date-Time',
				nameGap: 20
			},
			yAxis: {
				type: 'value',
				nameLocation: 'middle',
				name: 'PCU',
				nameGap: 50
			},
			series: [
				{
					data: y,
					type: 'line',
					areaStyle: {}
				}
			]

		}


	}



	navigateToAdminInputs() {
		this.router.navigate(['/junctionProperties'])
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

	// on clicking next button in paginator
	next() {

		// if next button in paginator is active (not disabled)
		if (this.classForNextButton !== "page-item disabled") {

			// go ahead 5 indices (meaning show next 5 table records accessing those indices)
			this.index = this.index + 10

			// set next 5 row values from CSV data (this.propService.data) to the dataSource variable
			// so that it can be shown in table
			this.dataSource = Object.values(this.csvData).slice(this.index, this.index + 10)

			// if index is pointing to last 5 records from the csv data then disable next button in paginator
			if (this.index === Object.values(this.csvData).length - 10) {
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
			this.index = this.index - 10

			// set next 5 row values from CSV data (this.propService.data) to the dataSource variable 
			// so that it can be shown in table
			this.dataSource = Object.values(this.csvData).slice(this.index, this.index + 10)

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
			this.predictedTableIndex = this.predictedTableIndex + 8

			// set next 5 row values from comparison table data (this.comparisonTableData) to the dataSource variable
			// so that it can be shown in table
			this.dataSourcePredicted = Object.values(this.actualVsPredictedComparisonTableData).slice(this.predictedTableIndex, this.predictedTableIndex + 8)

			// if index is pointing to last 5 records from the csv data then disable next button in paginator
			if (this.predictedTableIndex === Object.values(this.actualVsPredictedComparisonTableData).length - 5) {
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
			this.predictedTableIndex = this.predictedTableIndex - 8

			// set next 5 row values from comparison table data (this.comparisonTableData) to the dataSource variable 
			// so that it can be shown in table
			this.dataSourcePredicted = Object.values(this.actualVsPredictedComparisonTableData).slice(this.predictedTableIndex, this.predictedTableIndex + 8)

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
			// this.actual = Object.values(this.comparisonChartData)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			// this.predicted = Object.values(this.comparisonChartData)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			// this.difference = Object.values(this.comparisonChartData)[0]['difference'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			// this.labels = Object.values(this.comparisonChartData)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)

			this.actual = this.plotActual.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.predicted = this.plotPredicted.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.difference = this.plotDifference.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.labels = this.plotLabels.slice(this.predictedChartIndex, this.predictedChartIndex + 10)

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
			this.actual = this.plotActual.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.predicted = this.plotPredicted.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.difference = this.plotDifference.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.labels = this.plotLabels.slice(this.predictedChartIndex, this.predictedChartIndex + 10)


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

	navigateToPredictions() {
		this.router.navigate(['/prediction'])
	}


	async getAllRoadwayWidthMaxVehiclesMaps() {
		return new Promise<void>((resolve, reject) => {
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
						resolve()
					}
				},
				error: (error: HttpErrorResponse) => {
					alert(error)
					reject()
				}
			})
		})
	}


	async getAllJunctionRoadwayWidthMaps() {
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
					alert(error)
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
						if (element['junctionName'] == this.inputJunction) {
							this.junctionSpecificDataAvailable = true
						}
					}
					if (response != '') {
						resolve()
					}
				},
				error: (error: HttpErrorResponse) => {
					alert(error)
					reject()
				}
			})
		})
	}


	async getAllJunctionSpecificDataFromDBandRenderPredictions() {
		return new Promise<void>((resolve, reject) => {
			this.getJunctionDistrictMaps().then(() => {
				this.getAllJunctionRoadwayWidthMaps().then(() => {
					this.getAllRoadwayWidthMaxVehiclesMaps().then(() => {
						resolve()
					})
				})
			})
		})
	}



	getExistingData() {
		// existing data
		this.flaskService.getPlot().subscribe({
			next: (response) => {
				this.recievedPlotData = response
				this.junctionChoice = this.inputJunction
				this.toggleDataVisualizationTable = true
				this.show(this.junctionChoice)
			},
			error: (error: HttpErrorResponse) => {
				alert(error.message)
			}
		})
	}


	async getActualVsPredictedComparisons() {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.getActualVsPredictedComparison().subscribe({
				next: (response) => {
					this.allActualVsPredictedComparisonPlotData = response
					this.flaskService.getActualVsPredictedComparisonTableData().subscribe({
						next: (response) => {
							this.allActualVsPredicedComparisonTableData = response
							this.renderedAlgorithm = this.inputAlgorithm
							this.resultTestingRatios = Object.keys(Object.values(response)[0])
							this.renderedTestRatio = this.resultTestingRatios[0]
							resolve()
						},
						error: (error: HttpErrorResponse) => {
							alert(error.message)
							reject()
						}
					})
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
					reject()
				}
			})

		})

	}


	getAllModelSummaries() {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.getAllModelSummaries().subscribe({
				next: (response) => {
					this.allModelSummaries = response

					let maxAccuracyOfAll: number = -1
					let maxAccuracyDetails: Array<any> = []

					for (let i = 0; i < Object.keys(this.testRatiosComparisonData).length; i++) {
						let ratioData = Object.values(this.testRatiosComparisonData)[i]
						for (let j = 0; j < Object.values(ratioData).length; j++) {
							let currentNumber: number = (Object.values(ratioData)[j] as number)
							if (currentNumber > maxAccuracyOfAll) {
								maxAccuracyOfAll = currentNumber
								this.highestAccuracy = maxAccuracyOfAll
								maxAccuracyDetails = [Object.keys(this.testRatiosComparisonData)[i], parseFloat(Object.keys(ratioData)[j])]
							}
						}
					}

					this.testRatioHighestAccuracy = maxAccuracyDetails[1]
					this.algorithmHighestAccuracy = maxAccuracyDetails[0]
					this.algorithmToAddToMaster = maxAccuracyDetails[0]
					this.renderedAlgorithm = this.algorithmToAddToMaster
					this.testRatioToAddToMaster = maxAccuracyDetails[1].toString()
					this.renderedTestRatio = this.testRatioToAddToMaster

					this.changeUltimateComparisonFormat()
					this.renderAllComparisons()

					resolve()
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
					reject()
				}
			})
		})
	}


	setUltimateChartData() {
		return new Promise<void>((resolve, reject) => {
			this.ultimateData = []
			let maxAccuracy: number = -1
			for (let i = 0; i < Object.keys(this.testRatiosComparisonData).length; i++) {
				let legend: string = Object.keys(this.testRatiosComparisonData)[i]
				this.ultimateChartLegendsData.push(legend)
				let data: object = {
					name: legend,
					type: 'bar',
					barGap: 0,
					opacity: 0.1,
					emphasis: {
						focus: 'series'
					},
					data: Object.values(Object.values(this.testRatiosComparisonData)[i])
				}
				let arr: Array<number> = Object.values(Object.values(this.testRatiosComparisonData)[i])
				let currentMaxAccuracy: number = Math.max(...arr)
				maxAccuracy = (currentMaxAccuracy > maxAccuracy) ? currentMaxAccuracy : maxAccuracy;
				
				this.ultimateData.push(data)
			}
			let maxAccuracyArray = new Array(9).fill(maxAccuracy)
			let highestAccuracyLine: object = {
				type: 'line',
				name: 'Max Accuracy',
				data: maxAccuracyArray
			}
			this.ultimateData.push(highestAccuracyLine)
			resolve()
		})
	}


	async trainAllJunctionsAndGetComparisons(action: string) {
		return new Promise<void>((resolve, reject) => {
			this.flaskService.getTestingRatioComparisons(action, this.inputJunction).subscribe({
				next: (response) => {
					this.trained = true
					this._snackBar.open('Training process completed for ' + this.inputJunction, '', {
						horizontalPosition: 'center',
						verticalPosition: 'bottom'
					})
					this.startedTraining = false
					this.gotTestingRatioComparisons = true
					this.testingRatioComparisonChartNotReady = false
					this.testRatiosComparisonData = response

					this.setUltimateChartData().then(() => {
						this.getActualVsPredictedComparisons().then(() => {
							resolve()
						})
					})
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
					reject()
				}
			})
		})
	}


	changeShowByArray() {
		if (this.timeFormat == 'Years') {
			this.showByArray = ['Weeks', 'Months']
		}
		if (this.timeFormat == 'Months') {
			this.showByArray = ['Days', 'Weeks']
		}
		if (this.timeFormat == 'Days') {
			this.showByArray = ['Hours', 'Days']
		}
		this.showBy = this.showByArray[0]
	}


	async startTraining(action: string) {
		return new Promise<string>((resolve, reject) => {
			if (this.dataset != "" && this.uniqueJunctionsInDataset[0] == this.inputJunction) {
				this.gotTestingRatioComparisons = false
				this.predictionReady = false
				this.comparisonChartHidden = false
				this.modelSummaryReady = false
				this.comparisonTableReady = false
				this.modelSummary = []
				this.csvDataStored = true
				this.startedTraining = true
				if (this.csvDataStored) {
					this.dataSource = this.csvData.slice(this.index, this.index + 10)
					this.numberOfRecords = this.csvData.length
					this.testRatio = parseFloat(this.inputTestRatio)
					this.startProcess = true
					this.toggleErrorString = false
					if (this.datasetUploaded) {
						this.junctionsAlreadyTrained.add(this.inputJunction)
						this.trainAllJunctionsAndGetComparisons(action).then(() => {
							this.getAllModelSummaries().then(() => {
								this.time = 2
								this.timeFormat = 'Years'
								this.changeShowByArray()
								this.predict()


								this.flaskService.getEndYearFromDataset().subscribe({
									next: (response) => {
										this.startYear = Object.values(response)[0]
										if (this.startYear % 2 != 0) {
											this.startYear++
											this.trainingSummaryActive = true
											this.predictionsActive = true
											resolve('success')
										}
									},
									error: (error: HttpErrorResponse) => {
										resolve('error')
										alert(error.message)
									}
								})


							})
						})
					} else {
						this.startedTraining = false
						this._snackBar.open('Note: Upload a dataset first', '', {
							horizontalPosition: 'right',
							verticalPosition: 'bottom'
						})
						resolve('error')
					}
				} else {
					this.startedTraining = false
					this._snackBar.open('Note: Error in processing the dataset', '', {
						horizontalPosition: 'right',
						verticalPosition: 'bottom'
					})
					resolve('error')
				}
			} else {
				this.startedTraining = false
				this._snackBar.open('Note: Upload a proper dataset first', '\u2716', {
					horizontalPosition: 'right',
					verticalPosition: 'bottom',
					duration: 3000
				})
				resolve('error')
			}
		})
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
				let maxVehiclesCapacityArray = new Array(this.dateTimeToBePlotted.length).fill(this.currentMaxVehicles)
				this.plotFuturePredictions(maxVehiclesCapacityArray, this.dateTimeToBePlotted, this.vehiclesToBePlotted)
			}
		}
	}


	predict() {
		if (this.time != 0 && this.timeFormat != '') {
			let timeToBePredicted: object = {
				timePeriod: this.time,
				timeFormat: this.timeFormat,
				showBy: this.showBy,
				startYear: this.startYear
			}

			this.flaskService.sendInputTimeToPredict(timeToBePredicted).subscribe({
				next: (response) => {
					this.flaskService.predictForHighestAccuracy(this.inputJunction, this.algorithmHighestAccuracy, this.testRatioHighestAccuracy).subscribe({
						next: (response) => {
							this.futurePredictionsPlotData = response
							this.plotDataReady = true
							this.flaskService.getFuturePredictionsTable().subscribe({
								next: (response) => {
									this.futurePredictionsTableData = Object.values(response)
									this.getAllJunctionSpecificDataFromDBandRenderPredictions()
									this.futurePredictionsReady = true
									this.checkJunction()
									this.predictionReady = true
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
			this._snackBar.open('Note: provide time', '\u2716', {
				horizontalPosition: 'right',
				verticalPosition: 'bottom',
				duration: 3000
			})
		}
	}



	addToMaster() {

		if (this.algorithmToAddToMaster != "" && this.testRatioToAddToMaster != "" && this.startYear != 0
			// && this.relativeChange != ""
		) {
			let relativeChange = parseFloat(this.relativeChange)
			this.propService.relativeChange = relativeChange
			let testRatioToAddToMaster = parseFloat(this.testRatioToAddToMaster)
			this.flaskService.addToMaster(
				this.inputJunction,
				this.algorithmToAddToMaster,
				testRatioToAddToMaster,
				this.startYear
			).subscribe({
				next: (response) => {
					this._snackBar.open('Added to master', '\u2716', {
						horizontalPosition: 'right',
						verticalPosition: 'bottom',
						duration: 3000
					})
					this.checkIfAddedToMaster()
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
				}
			})
		} else {
			this._snackBar.open('Note: Provide details', '\u2716', {
				horizontalPosition: 'right',
				verticalPosition: 'bottom',
				duration: 3000
			})
		}

	}



	setActualVsPredictedComparisonPlotData() {
		// for arranging plot data
		for (let i = 0; i < Object.keys(this.allActualVsPredictedComparisonPlotData).length; i++) {
			if (Object.keys(this.allActualVsPredictedComparisonPlotData)[i] == this.renderedAlgorithm) {
				for (let j = 0; j < Object.keys(Object.values(this.allActualVsPredictedComparisonPlotData)[i]).length; j++) {
					if (Object.keys(Object.values(this.allActualVsPredictedComparisonPlotData)[i])[j] == this.renderedTestRatio) {
						this.actualVsPredictedComparisonPlotData = Object.values(Object.values(this.allActualVsPredictedComparisonPlotData)[i])[j] as Object
					}
				}
			}
		}
	}

	setActualVsPredictedComparisonTableData() {
		// for arranging table data
		for (let i = 0; i < Object.keys(this.allActualVsPredicedComparisonTableData).length; i++) {
			if (Object.keys(this.allActualVsPredicedComparisonTableData)[i] == this.renderedAlgorithm) {
				for (let j = 0; j < Object.keys(Object.values(this.allActualVsPredicedComparisonTableData)[i]).length; j++) {
					if (Object.keys(Object.values(this.allActualVsPredicedComparisonTableData)[i])[j] == this.renderedTestRatio) {
						this.actualVsPredictedComparisonTableData = Object.values(Object.values(this.allActualVsPredicedComparisonTableData)[i])[j]
					}
				}
			}
		}
		this.numberOfRecordsPredicted = Object.values(this.actualPredictedTableData).length
		this.dataSourcePredicted = Object.values(this.actualVsPredictedComparisonTableData).slice(this.predictedTableIndex, this.predictedTableIndex + 8)
		this.comparisonTableReady = true
	}


	async separateLinesForActualVsPredictedComparisonLinePlot() {
		return new Promise<void>((resolve, reject) => {
			// for separating predicted line, actual line and diference in plot
			for (let i = 0; i < Object.keys(this.actualVsPredictedComparisonPlotData).length; i++) {
				if (Object.keys(this.actualVsPredictedComparisonPlotData)[i] == 'actual') {
					this.plotActual = Object.values(this.actualVsPredictedComparisonPlotData)[i]
					this.actual = this.plotActual.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
				}
				if (Object.keys(this.actualVsPredictedComparisonPlotData)[i] == 'predicted') {
					this.plotPredicted = Object.values(this.actualVsPredictedComparisonPlotData)[i]
					this.predicted = this.plotPredicted.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
				}
				if (Object.keys(this.actualVsPredictedComparisonPlotData)[i] == 'difference') {
					this.plotDifference = Object.values(this.actualVsPredictedComparisonPlotData)[i]
					this.difference = this.plotDifference.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
				}
				if (Object.keys(this.actualVsPredictedComparisonPlotData)[i] == 'labels') {
					this.plotLabels = Object.values(this.actualVsPredictedComparisonPlotData)[i]
					this.labels = this.plotLabels.slice(this.predictedChartIndex, this.predictedChartIndex + 10)
				}
			}

			for (let i = 0; i < this.labels.length; i++) {
				this.labels[i] = this.labels[i].slice(0, this.labels[i].length - 9)
			}

			resolve()
		})
	}

	compareChart(labels: string[], actual: number[], predicted: number[], difference: number[]) {
		this.mapOptionActualVsPredicted = {
			tooltip: {
				trigger: 'axis'
			},
			xAxis: {
				data: labels,
				axisLabel: {
					interval: 0,
					rotate: 20,
				},
				nameLocation: 'middle',
				name: 'Date-Time',
				nameGap: 50
			},
			yAxis: {
				nameLocation: 'middle',
				name: 'Values',
				nameGap: 30
			},
			series: [
				{
					data: actual,
					type: 'line',
				},
				{
					data: predicted,
					type: 'line',
				},
				{
					data: difference,
					type: 'bar',
					itemStyle: {
						// barBorderRadius: 5,
						borderWidth: 2,
						borderType: 'solid',
						borderColor: '#c0c0c0',
						shadowColor: '#c0c0c0',
						shadowBlur: 3,
						opacity: 0.1
					},
				}
			]
		}

	}

	plotActualVsComparisonPlot() {
		this.numberOfPlotDataEntries = this.plotPredicted.length
		if (this.predictedChart != null) { this.predictedChart.destroy() }
		this.compareChart(this.labels, this.actual, this.predicted, this.difference)
	}



	async setAccuracyBarChartData() {
		return new Promise<[string[], number[]]>((resolve, reject) => {
			let accuracyBarChartAlgorithmsAxis: Array<string> = []
			let accuracyBarChartAccuraciesAxis: Array<number> = []
			for (let i = 0; i < Object.keys(this.testRatiosComparisonData).length; i++) {
				let record: tableRecord = {
					junctionOrAlgorithm: Object.keys(this.testRatiosComparisonData)[i],
					accuracy: Object.values(this.testRatiosComparisonData)[i][this.renderedTestRatio]
				}
				this.accuracies.push(record)
				let accuracyShortString = Object.keys(this.testRatiosComparisonData)[i]
				accuracyShortString = accuracyShortString.slice(0, accuracyShortString.length - 11)
				accuracyBarChartAlgorithmsAxis.push(accuracyShortString)

				for (let j = 0; j < Object.keys(Object.values(this.testRatiosComparisonData)[i]).length; j++) {
					if (Object.keys(Object.values(this.testRatiosComparisonData)[i])[j] == this.renderedTestRatio) {
						accuracyBarChartAccuraciesAxis.push(Object.values(Object.values(this.testRatiosComparisonData)[i])[j] as number)
					}
				}
			}
			resolve([accuracyBarChartAlgorithmsAxis, accuracyBarChartAccuraciesAxis])
		})
	}


	plotAccuracyBarChart(accuracyBarChartAlgorithmsAxis: Array<string>, accuracyBarChartAccuraciesAxis: Array<number>) {
		this.accuracyBarChartHidden = false
		this.testingRatioComparisonChartNotReady = false
		this.mapOptionAlgorithmComparison = {
			tooltip: {
				trigger: 'axis'
			},
			xAxis: {
				type: 'category',
				data: accuracyBarChartAlgorithmsAxis,
				axisLabel: {
					interval: 0,
					rotate: 20,
				},
				nameLocation: 'middle',
				name: 'Algorithm',
				nameGap: 50
			},
			yAxis: {
				type: 'value',
				nameLocation: 'middle',
				name: 'Accuracy',
				nameGap: 30
			},
			series: [
				{
					data: accuracyBarChartAccuraciesAxis,
					itemStyle: {
						borderWidth: 2,
						borderType: 'solid',
						borderColor: '#ff0000',
						shadowColor: '#0000ff',
						shadowBlur: 3,
						opacity: 0.3
					},
					type: 'bar'
				}
			],
		}
	}



	async setTestRatioComparisonChartData() {
		return new Promise<[string[], number[]]>((resolve, reject) => {
			let testRatioComparisonChartTestRatiosAxis: Array<string> = []
			let testRatioComparisonChartAccuraciesAxis: Array<number> = []
			for (let i = 0; i < Object.keys(this.testRatiosComparisonData).length; i++) {
				if (Object.keys(this.testRatiosComparisonData)[i] == this.renderedAlgorithm) {
					testRatioComparisonChartTestRatiosAxis = Object.keys(Object.values(this.testRatiosComparisonData)[i])
					testRatioComparisonChartAccuraciesAxis = Object.values(Object.values(this.testRatiosComparisonData)[i])
				}
			}
			for (let i = 0; i < testRatioComparisonChartTestRatiosAxis.length; i++) {
				if (testRatioComparisonChartTestRatiosAxis[i].length > 3) {
					testRatioComparisonChartTestRatiosAxis[i] = "0." + testRatioComparisonChartTestRatiosAxis[i][2]
				}
			}
			resolve([testRatioComparisonChartTestRatiosAxis, testRatioComparisonChartAccuraciesAxis])
		})
	}


	plotTestRatioComparisonsChart(testRatioComparisonChartTestRatiosAxis: Array<string>, testRatioComparisonChartAccuraciesAxis: Array<number>) {
		if (this.testRatioComparisonChart != null) { this.testRatioComparisonChart.destroy() }
		this.mapOptionTestingRatiosComparison = {
			tooltip: {
				trigger: 'axis'
			},
			xAxis: {
				type: 'category',
				data: testRatioComparisonChartTestRatiosAxis,
				nameLocation: 'middle',
				name: 'Testing ratios',
				nameGap: 50
			},
			yAxis: {
				type: 'value',
				nameLocation: 'middle',
				name: 'Accuracy',
				nameGap: 30
			},
			series: [
				{
					data: testRatioComparisonChartAccuraciesAxis,
					type: 'bar',
					itemStyle: {
						borderWidth: 2,
						borderType: 'solid',
						shadowColor: '#ff0000',
						borderColor: '#0000ff',
						shadowBlur: 3,
						opacity: 0.3
					},
				}
			]
		}
	}


	setModelSummary() {
		this.modelSummaryReady = true
		for (let i = 0; i < Object.keys(this.allModelSummaries).length; i++) {
			if (Object.keys(this.allModelSummaries)[i] == this.renderedAlgorithm) {

				for (let j = 0; j < Object.keys(Object.values(this.allModelSummaries)[i]).length; j++) {
					if (Object.keys(Object.values(this.allModelSummaries)[i])[j] == this.renderedTestRatio) {
						this.modelSummary = Object.values(Object.values(this.allModelSummaries)[i])[j]
					}
				}

			}
		}
	}


	renderAllComparisons() {
		this.setActualVsPredictedComparisonTableData()
		this.setActualVsPredictedComparisonPlotData()
		this.separateLinesForActualVsPredictedComparisonLinePlot().then(() => {
			this.plotActualVsComparisonPlot()
		})

		this.setAccuracyBarChartData().then((array: [string[], number[]]) => {
			this.plotAccuracyBarChart(array[0], array[1])
		})

		this.setTestRatioComparisonChartData().then((array: [string[], number[]]) => {
			this.plotTestRatioComparisonsChart(array[0], array[1])


			for (let i = 0; i < array[0].length; i++) {
				let record: Object = {
					testRatio: array[0][i],
					accuracy: array[1][i]
				}
				this.testRatioComparisonTableData.push(record)
			}


		})

		this.setModelSummary()
	}

	changeJunction() {
		this.trained = false
		this.dismissSnackBar()
	}

	dismissSnackBar() {
		this._snackBar.dismiss()
		if (this.tabIndex == 0  && this.trained) {
			this._snackBar.open('Training process completed', '', {
				horizontalPosition: 'center',
				verticalPosition: 'bottom'
			})
		}
	}


}