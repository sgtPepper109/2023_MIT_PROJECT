import { Component, OnInit, ViewChild } from '@angular/core';
import { PropService } from '../services/propService/prop.service';
import { OperationService } from '../services/operationService/operation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlaskService } from '../services/flaskService/flask.service';
import { MatPaginator } from '@angular/material/paginator';
import { Chart } from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers'


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
		this.displayedColumns = ['DateTime', 'Junction', 'Vehicles', 'ID', 'Year', 'Month', 'Day', 'Hour'];
		this.dataSource = Object.values(this.propService.data).slice(this.index, this.index + 5)
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
	indexResult = 0
	resultTableReady = false
	previousDisabled = true
	classForPreviousButton = "page-item disabled"
	classForNextButton = "page-item"
	classForPreviousButtonResult = "page-item disabled"
	classForNextButtonResult = "page-item"
	displayedColumns: string[] = []
	displayedColumnsResult: string[] = []
	dataSource: any
	dataSourceResult: any
	tableResult: object = {}
	gotAccuracy = false

    // to show the prediction image when training ends 
	predictionImageReady = false
	myChart: any
	plot: any


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
				  beginAtZero: true
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

    // if new input is given then this function fires to switch off the predicted image 
	disablePredictionImage() {
		this.predictionImageReady = false
	}

    // on click predict button
	start() {

        // check whether the fields have no value
		if (this.inputJunction !== "Choose Junction" && this.inputMonths !== "") {

            // set the object to be sent to back-end
			this.propService.obj = {junction: this.inputJunction, months: this.inputMonths}
			//console.log(this.inputJunction)

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
							  beginAtZero: true
							}
						  }
						}
					  });

                    // if prediction image is ready then turn off loading message
					this.flaskService.getResultTable().subscribe(
						(response) => {
							this.resultTableReady = true
							// console.log('resultTable', response)
							this.tableResult = response
							this.displayedColumnsResult = ['DateTime', 'Junction', 'Vehicles', 'Year', 'Month', 'Day', 'Hour'];
							this.dataSourceResult = Object.values(response).slice(this.index, this.index + 10)
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
