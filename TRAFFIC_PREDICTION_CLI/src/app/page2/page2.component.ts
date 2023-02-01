import { Component, OnInit, ViewChild } from '@angular/core';
import { PropService } from '../services/propService/prop.service';
import { OperationService } from '../services/operationService/operation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlaskService } from '../services/flaskService/flask.service';
import { MatPaginator } from '@angular/material/paginator';
import { Chart } from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers'
import { ngxCsv } from 'ngx-csv';


@Component({
	selector: 'app-page2',
	templateUrl: './page2.component.html',
	styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnInit {
	constructor(
		private propService: PropService, 
		private operationService: OperationService,
		private _snackBar: MatSnackBar,
		private flaskService: FlaskService
	) {
		// console.log("this.propService.data", Object.values(this.propService.data).slice(1, 3))
		this.displayedColumns = ['DateTime', 'Junction', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];
		this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)
		this.numberOfRecords = Object.values(this.propService.data).length
		// console.log(Object.values(this.propService.data).length)
		// console.log(Object.values(this.propService.data).length)
		// console.log("Object.values(this.propService.data)", Object.values(this.propService.data))
		this.flaskService.getPlot().subscribe(
			(response) => {
				this.recievedPlotData = response
				this.plotReady = true
				// this.datetime = Object.values(response)[0]['datetime']
				// this.vehicles = Object.values(response)[0]['vehicles']
				// this.LineChart(this.datetime, this.vehicles)
			},
			(error: HttpErrorResponse) => {
				console.log(error.message)
				alert(error.message)
				
			}
		)
		if (this.index !== 0) { this.classForPreviousButton = "page-item" }
	}

	recievedPlotData: object = {}

	vehicles = []
	datetime = []
	actual = []
	predicted = []
	labels = []

	// error message to be displayed on the screen
	errorstring: string = ""

	// for displaying if validations are not correct
	toggleErrorString = false;

    // for loading symbol when training starts
	startedTraining = false;

    // input variables for junction and months
	inputJunction = "Choose Junction"
	inputMonths = ""

    // object to be passed to the back-end that comprises of junction and months
	obj = {}
	junction1plot: any
	junction2plot: any
	junction3plot: any
	junction4plot: any

    // boolean switches for showing plots
    // if plotReadyFor1 is true then only plot for junction 1 shows
	plotReady = false
	accuracyScore: any
	index = 0
	numberOfRecords = 0
	indexResult = 0
	numberOfRecordsResult = 0
	resultTableReady = false
	previousDisabled = true
	classForPreviousButton = "page-item disabled"
	classForNextButton = "page-item"
	classForPreviousButtonResult = "page-item disabled"
	classForNextButtonResult = "page-item"
	classForPreviousButtonPlot = "page-item disabled"
	classForNextButtonPlot = "page-item"
	displayedColumns: string[] = []
	displayedColumnsResult: string[] = []
	dataSource: any
	dataSourceResult: any
	tableResult: object = {}
	tablePredicted: object = {}
	gotAccuracy = false
	predictedTableReady = false
	predictedTableIndex = 0
	numberOfRecordsPredicted = 0
	dataSourcePredicted: any
	displayedColumnsPredicted = ['Actual', 'Predicted']
	classForPreviousButtonPredicted = "page-item disabled"
	classForNextButtonPredicted = "page-item"

    // to show the prediction image when training ends 
	predictionImageReady = false
	myChart: any
	plot: any
	predictedChart: any
	predictedChartIndex = 0
	predictionPlotData: object = {}
	numberOfPlotDataEntries = 0

	LineChart(x: any, y: any) {
		// console.log(x)
		// console.log("this.datetime", this.datetime)
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
	
	ngOnInit(): void {}

	show1() {
		// console.log("this.recievedPlotData: ", this.recievedPlotData)
		this.datetime = Object.values(this.recievedPlotData)[0]['datetime']
		this.vehicles = Object.values(this.recievedPlotData)[0]['vehicles']
		// console.log(this.datetime, this.vehicles)
		if (this.plot != null) { this.plot.destroy() }
		this.LineChart(this.datetime, this.vehicles)
	}
	show2() {
		this.datetime = Object.values(this.recievedPlotData)[1]['datetime']
		this.vehicles = Object.values(this.recievedPlotData)[1]['vehicles']
		if (this.plot != null) { this.plot.destroy() }
		this.LineChart(this.datetime, this.vehicles)
	}
	show3() {
		this.datetime = Object.values(this.recievedPlotData)[2]['datetime']
		this.vehicles = Object.values(this.recievedPlotData)[2]['vehicles']
		if (this.plot != null) { this.plot.destroy() }
		this.LineChart(this.datetime, this.vehicles)
	}
	show4() {
		this.datetime = Object.values(this.recievedPlotData)[3]['datetime']
		this.vehicles = Object.values(this.recievedPlotData)[3]['vehicles']
		if (this.plot != null) { this.plot.destroy() }
		this.LineChart(this.datetime, this.vehicles)
	}

	next() {
		console.log('next')
		if (this.classForNextButton !== "page-item disabled") {
			this.index = this.index + 5
			this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)
			if (this.index === Object.values(this.propService.data).length - 5) {
				this.classForNextButton = "page-item disabled"
			}
		}

		if (this.index >= 5) {
			this.classForPreviousButton = "page-item"
		}
	}

	previous() {
		console.log('prev')
		if(this.classForPreviousButton !== "page-item disabled") {
			this.index = this.index - 5
			this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)
			if (this.index === 0) {
				this.classForPreviousButton = "page-item disabled"
			} else {
				this.classForPreviousButton = "page-item"
			}
		}
	}

	nextResult() {
		console.log('nextres')
		if (this.classForNextButtonResult !== "page-item disabled") {
			this.indexResult = this.indexResult + 10
			this.dataSourceResult = Object.values(this.tableResult).slice(this.indexResult, this.indexResult + 10)
			if (this.indexResult === Object.values(this.tableResult).length - 10) {
				this.classForNextButtonResult = "page-item disabled"
			}
		}

		if (this.indexResult >= 10) {
			this.classForPreviousButtonResult = "page-item"
		}
	}

	previousResult() {
		console.log('prevres')
		if(this.classForPreviousButtonResult !== "page-item disabled") {
			this.indexResult = this.indexResult - 10
			this.dataSourceResult = Object.values(this.tableResult).slice(this.indexResult, this.indexResult + 10)
			if (this.indexResult === 0) {
				this.classForPreviousButtonResult = "page-item disabled"
			} else {
				this.classForPreviousButtonResult = "page-item"
			}
		}
	}

	nextPredicted() {
		console.log('nextpred')
		if (this.classForNextButtonPredicted !== "page-item disabled") {
			this.predictedTableIndex = this.predictedTableIndex + 5
			this.dataSourcePredicted = Object.values(this.tablePredicted).slice(this.predictedTableIndex, this.predictedTableIndex + 5)
			if (this.predictedTableIndex === Object.values(this.tablePredicted).length - 5) {
				this.classForNextButtonPredicted = "page-item disabled"
			}
		}

		if (this.predictedTableIndex >= 5) {
			this.classForPreviousButtonPredicted = "page-item"
		}
	}

	previousPredicted() {
		console.log('prevpred')
		if(this.classForPreviousButtonPredicted !== "page-item disabled") {
			this.predictedTableIndex = this.predictedTableIndex - 5
			this.dataSourcePredicted = Object.values(this.tablePredicted).slice(this.predictedTableIndex, this.predictedTableIndex + 5)
			if (this.predictedTableIndex === 0) {
				this.classForPreviousButtonPredicted = "page-item disabled"
			} else {
				this.classForPreviousButtonPredicted = "page-item"
			}
		}
	}

	compareChart(labels: number[], actual: number[], predicted: number[]) {
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

	next10Plot() {
		console.log('nextplot')
		if (this.classForNextButtonPlot !== "page-item disabled") {
			this.predictedChartIndex = this.predictedChartIndex + 10
			this.actual = Object.values(this.predictionPlotData)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.predicted = Object.values(this.predictionPlotData)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.labels = Object.values(this.predictionPlotData)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			
			this.compareChart(this.labels, this.actual, this.predicted)
			if (this.predictedChartIndex === Object.values(this.predictionPlotData).length - 10) {
				this.classForNextButtonPlot = "page-item disabled"
			}
		}

		if (this.predictedChartIndex >= 10) {
			this.classForPreviousButtonPlot = "page-item"
		}
	}

	previous10Plot() {
		console.log('prev')
		if(this.classForPreviousButtonPlot !== "page-item disabled") {
			this.predictedChartIndex = this.predictedChartIndex - 10
			this.actual = Object.values(this.predictionPlotData)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.predicted = Object.values(this.predictionPlotData)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			this.labels = Object.values(this.predictionPlotData)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
			
			this.compareChart(this.labels, this.actual, this.predicted)
			if (this.predictedChartIndex === 0) {
				this.classForPreviousButtonPlot = "page-item disabled"
			} else {
				this.classForPreviousButtonPlot = "page-item"
			}
		}
	}


	
    // if new input is given then this function fires to switch off the predicted image 
	disablePredictionImage() {
		this.predictionImageReady = false
	}

	exportToCsv() {
		var options = { 
			fieldSeparator: ',',
			quoteStrings: '',
			decimalseparator: '.',
			showLabels: true,
			useBom: true,
			noDownload: false,
			headers: ['DateTime', 'Day', 'Hour', 'Junction', 'Month', 'Vehicles', 'Year']
		};
		new ngxCsv(this.tableResult, "result", options);
	}

    // on click predict button
	start() {

        // check whether the fields have no value
		if (this.inputJunction !== "Choose Junction" && this.inputMonths !== "") {

            // set the object to be sent to back-end
			this.propService.obj = {junction: this.inputJunction, months: this.inputMonths}
			//console.log(this.inputJunction)
			this.toggleErrorString = false
			this.startedTraining = true;
			this.flaskService.predict(this.inputJunction + '_' + this.inputMonths).subscribe(
				(response) => {
					console.log("predict", response)
					this.startedTraining = false;
					this.predictionImageReady = true
					this.datetime = Object.values(response)[0]['datetime']
					this.vehicles = Object.values(response)[0]['vehicles']
					this.predictionImageReady = true
					// console.log(this.datetime, this.vehicles)
					if (this.myChart != null) { this.myChart.destroy() }
					this.myChart = new Chart("myChart", {
						type: 'line',
						data: {
						  labels: this.datetime,
						  datasets: [{
							label: '# of Vehicles',
							data: this.vehicles,
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

                    // if prediction image is ready then turn off loading message
					this.flaskService.getResultTable().subscribe(
						(response) => {
							this.resultTableReady = true
							console.log('resultTable', response)
							this.tableResult = response
							this.displayedColumnsResult = ['DateTime', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];
							this.dataSourceResult = Object.values(response).slice(this.index, this.index + 10)
							this.numberOfRecordsResult = Object.values(response).length
						},
						(error: HttpErrorResponse) => {
							console.log(error)
							alert(error.message)
						}
					)

					this.flaskService.getAccuracy().subscribe(
						(response) => {
							console.log(response)
							this.gotAccuracy = true
							this.accuracyScore = Object.values(response)
						},
						(error: HttpErrorResponse) => {
							console.log(error)
							alert(error.message)
						}
					)

					this.flaskService.getActualPredicted().subscribe(
						(response) => {
							// console.log(response)
							this.predictedTableReady = true
							this.tablePredicted = response
							this.dataSourcePredicted = Object.values(response).slice(this.predictedTableIndex, this.predictedTableIndex + 5)
							this.numberOfRecordsPredicted = Object.values(response).length
						},
						(error: HttpErrorResponse) => {
							console.log(error)
							alert(error.message)
						}
					)

					this.flaskService.getActualPredictedForPlot().subscribe(
						(response) => {
							console.log(response)
							this.predictionPlotData = response
							console.log("this.predictedChartIndex", this.predictedChartIndex)
							this.actual = Object.values(response)[0]['actual'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
							this.predicted = Object.values(response)[0]['predicted'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
							this.labels = Object.values(response)[0]['labels'].slice(this.predictedChartIndex, this.predictedChartIndex + 10)
							this.numberOfPlotDataEntries = Object.values(response)[0]['actual'].length
							console.log("this.actual", this.actual)
							console.log("this.predicted", this.predicted)
							console.log("this.lables", this.labels)
							// console.log()
							
							if (this.predictedChart != null) { this.predictedChart.destroy() }
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
												text: 'values'
											}
										}
									}
								}
							  });
						},
						(error: HttpErrorResponse) => {
							console.log(error)
							alert(error.message)
						}
					)
					
				},
				(error: HttpErrorResponse) => {
					console.log(error.message)
				}
			)

		} else {
			this.errorstring = "Note: All fields are required"
			this.toggleErrorString = true
			this._snackBar.open("Note: All fields are required", '\u2716')
		}
	}
}
