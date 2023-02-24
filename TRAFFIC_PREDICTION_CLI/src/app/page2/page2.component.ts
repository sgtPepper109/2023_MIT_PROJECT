import { Component, OnInit } from '@angular/core';
import { PropService } from '../services/propService/prop.service';
import { OperationService } from '../services/operationService/operation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlaskService } from '../services/flaskService/flask.service';
import { FlaskAutopredictedService } from '../services/flaskAutoPredictedService/flask.autopredicted.service';
import { Chart } from 'chart.js/auto';
import { ngxCsv } from 'ngx-csv';
import { Routes, Router, RouterModule } from '@angular/router';


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
		private flaskAutoPredictedService: FlaskAutopredictedService
	) {}

	recievedPlotData: object = {}  // Object containing vehicles vs datetime information of all junctions
	vehicles: Array<number> = []  // Vehicles array to display on y axis of chart
	datetime = []  // DateTime array to display on x axis of chart
	actual: Array<number> = []  // Actual values array for plotting on chart for comparison
	predicted: Array<number> = []  // Predicted values array for plotting on chart for comparison
	labels = []  // Index (prediction number) array for plotting
	maxLimitArray: number[] = []
	maxInPlotArray: number[] = []

	plotDataReady: boolean = false

	vehiclesToBePlotted: any
	dateTimeToBePlotted: any
	errorstring: string = "" // error message to be displayed on the screen
	junctionToBeRendered: string = "Junction 1"
	allJunctionsPlotData: any
	currentJunctionPlotData: any

	dataVisualizationType: string = "Table"
	dataVisualizationJunctionName: string = "Junction 1"
	junctionToBePlotted: string = "Junction 1"
	futurePredictionsRepresentationType: string = "Table"
	comparisonDataRepresentationType: string = "Table"
	inputJunction: string = "Choose Junction"// input variables for junction and months
	inputTime: string = ""
	inputAlgorithm: string = "Random Forest Regression"
	time: string = "Days"
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

	
	changeJunctionToBeRendered() {
		console.log("allJunctionsPredictedData", this.allJunctionsPredictedData)
		console.log("allJunctionsPlotData", this.allJunctionsPlotData)
		if (this.junctionToBeRendered === 'Junction 1') {
			this.currentJunctionsPredictedData = this.allJunctionsPredictedData[0]
			if (this.plotDataReady) {
				this.currentJunctionPlotData = this.allJunctionsPlotData[0]
			}
		}
		if (this.junctionToBeRendered === 'Junction 2') {
			this.currentJunctionsPredictedData = this.allJunctionsPredictedData[1]
			if (this.plotDataReady) {
				this.currentJunctionPlotData = this.allJunctionsPlotData[1]
			}
		}
		if (this.junctionToBeRendered === 'Junction 3') {
			this.currentJunctionsPredictedData = this.allJunctionsPredictedData[2]
			if (this.plotDataReady) {
				this.currentJunctionPlotData = this.allJunctionsPlotData[2]
			}
		}
		if (this.junctionToBeRendered === 'Junction 4') {
			this.currentJunctionsPredictedData = this.allJunctionsPredictedData[3]
			if (this.plotDataReady) {
				this.currentJunctionPlotData = this.allJunctionsPlotData[3]
			}
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
			this.setVehiclesAndDateTime(this.currentJunctionPlotData[0]['vehicles'], this.currentJunctionPlotData[0]['datetime'])
			this.plotFuturePredictions(this.dateTimeToBePlotted, this.vehiclesToBePlotted)
		}
	}

	setVehiclesAndDateTime(param1: any, param2: any) {
		console.log("param1", param1)
		console.log("param2", param2)
		this.vehiclesToBePlotted = param1
		this.dateTimeToBePlotted = param2
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







	checkPredictions() {
		if (!this.resultTableReady) {
			this.errorstring = "Warning: Training not done"
			this.toggleErrorString = true
		}
	}



	

	plotFuturePredictions(x: any, y: any) {
		// prediction is done
		this.futurePredictionsChartHidden = false
		console.log("x", x)
		console.log("y", y)

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




	getPredictionInformation() {
		this.flaskAutoPredictedService.getAllJunctionsAccuracies().subscribe({
			next: (response) => {
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error)
			}
		})

		this.flaskAutoPredictedService.getAllJunctionsAccuracyScore().subscribe({
			next: (response) => {
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error)
			}
		})


		this.flaskAutoPredictedService.getPredictedTableData().subscribe({
			next: (response) => {
				this.allJunctionsPredictedData = response
				this.changeJunctionToBeRendered()
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error)
			}
		})

		this.flaskAutoPredictedService.getAllJunctionsPlotData().subscribe({
			next: (response) => {
				this.allJunctionsPlotData = response
				console.log(this.allJunctionsPlotData)
				this.plotDataReady = true
				this.changeJunctionToBeRendered()
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error)
			}
		})


	}

	


	// on click predict button
	ngOnInit() {
		console.log(this.propService)
		

		// no errors in validation
		// hence don't show error alert
		this.toggleErrorString = false

		// set startedTraining to true to show spinner till training and processing has completed
		this.startedTraining = true;

		if (this.propService.dataset !== '') {


			this.flaskService.getResultTable().subscribe({
				next: (response) => {
					this.allJunctionsPredictedData = response
					console.log('resultTable', this.allJunctionsPredictedData)
					this.allJunctionsPlotData = this.propService.predictionPlotData
					this.plotDataReady = true
					this.changeJunctionToBeRendered()
				},
				error: (error: HttpErrorResponse) => {
					console.log(error)
					alert(error)
				}
			})
		} else {
			console.log('autopredicting')
			this.getPredictionInformation()
		}


	}

}
