import { Component, OnInit } from '@angular/core';
import { PropService } from '../services/propService/prop.service';
import { OperationService } from '../services/operationService/operation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlaskService } from '../services/flaskService/flask.service';


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
		// console.log("this.propService.data", this.propService.data)
		// console.log("Object.values(this.propService.data)", Object.values(this.propService.data))
		this.flaskService.getPlot().subscribe(
			(response) => {
				this.junction1plot = Object.values(response)[0]
				this.junction2plot = Object.values(response)[1]
				this.junction3plot = Object.values(response)[2]
				this.junction4plot = Object.values(response)[3]
				// console.log(this.junction1plot, this.junction2plot, this.junction3plot, this.junction4plot)
			},
			(error: HttpErrorResponse) => {
				console.log(error.message)
				alert(error.message)
				
			}
		)
	}

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
	plotReadyFor1 = false
	plotReadyFor2 = false
	plotReadyFor3 = false
	plotReadyFor4 = false

	str = ""

    // to show the prediction image when training ends 
	predictionImageReady = false

	ngOnInit() {}

	show1() {
		this.str = "1"
		this.plotReadyFor1 = true
		this.plotReadyFor2 = false
		this.plotReadyFor3 = false
		this.plotReadyFor4 = false
	}
	show2() {
		this.str = "2"
		this.plotReadyFor1 = false
		this.plotReadyFor2 = true
		this.plotReadyFor3 = false
		this.plotReadyFor4 = false
	}
	show3() {
		this.str = "3"
		this.plotReadyFor1 = false
		this.plotReadyFor2 = false
		this.plotReadyFor3 = true
		this.plotReadyFor4 = false
	}
	show4() {
		this.str = "4"
		this.plotReadyFor1 = false
		this.plotReadyFor2 = false
		this.plotReadyFor3 = false
		this.plotReadyFor4 = true
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
					console.log(response)

                    // if prediction image is ready then turn off loading message
					this.startedTraining = false;
					this.predictionImageReady = true
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

	displayedColumns: string[] = ['DateTime', 'Junction', 'Vehicles', 'ID', 'Year', 'Month', 'Day', 'Hour'];
	dataSource = Object.values(this.propService.data)
}
