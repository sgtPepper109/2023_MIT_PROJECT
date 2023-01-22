import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Operation } from '../operation';
import { OperationService } from '../operation.service';
import { PropService } from '../prop.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent {
	constructor(
		private router: Router,
		private operationService: OperationService,
		private propService: PropService,
		private _snackBar: MatSnackBar
	) {}

	public operations: Operation[] = [];

	// declaring all the input field variables with help of ngModel
	dataset: string = ""
	inputtrainratio: string = ""
	inputtestratio: string = ""
	inputvalratio: string = ""

	// error message to be displayed on the screen
	errorstring: string = ""

	// for displaying if validations are not correct
	toggleErrorString = false;
	start = false

	// get operations functionality to test
	public getOperations(): void {
		this.operationService.getOperations().subscribe(
			(response: Operation[]) => {
				this.operations = response
				// console.log(this.operations)
			},
			(error: HttpErrorResponse) => {
				this.errorstring = "Note: Error encountered while connecting to server"
				this.toggleErrorString = true
			}
		)
	}

	// add operation functionality
	public addOperation(operation: Operation): void {
		// call addOperation service
		this.operationService.addOperation(operation).subscribe(
			(response: Operation) => {
				// console.log(response)
				
				// on success, navigate to page2
				this.getOperations()
			},
			(error: HttpErrorResponse) => {
				this.errorstring = "Note: Error encountered while connecting to server"
				this.toggleErrorString = true
			}
		)
	}

	// on clicking button 'process data'
	manageInfo() {

		if (this.dataset !== "" && this.inputtestratio !== "" && this.inputtrainratio !== "" && this.inputvalratio !== "") {
			var trainratio = parseFloat(this.inputtrainratio)
			var testratio = parseFloat(this.inputtestratio)
			var valratio = parseFloat(this.inputvalratio)
			
			var datasetString = this.dataset
			var arr = datasetString.split('.')
			if (arr[1] === 'csv' || arr[1] === 'data' || arr[1] === 'xlsx') {

				if (trainratio + testratio + valratio === 1.0) {
					// console.log(this.dataset, ' ', this.inputtrainratio, this.inputtestratio, this.inputvalratio)

					// Create an object of type Operation specified in ../operation.ts to pass it to backend
					let operation: Operation = {
						dataset: this.dataset,
						trainratio: trainratio,
						testratio: testratio,
						valratio: valratio,
						user_id: 1234567890
					}

					this.addOperation(operation)
					this.operationService.getData().subscribe(
						(response) => {
							console.log(typeof response, response)
							this.propService.data = response
							this.router.navigate(['/page2'])
						},
						(error: HttpErrorResponse) => {
							console.log(error.message)
							alert(error.message)
							
						}
					)

				} else {
					this.errorstring = "Note: The ratios don't add up to 1"
					this.toggleErrorString = true
					this._snackBar.open("Note: The ratios don't add up to 1", '\u2716')
				}
			} else {
				this.errorstring = "Note: Incorrect file type (Please choose a .csv, or a .xlsx or a .data file"
				this.toggleErrorString = true
				this._snackBar.open("Note: Incorrect file type (Please choose a .csv, or a .xlsx or a .data file", 'x')
			}
		} else {
			this.errorstring = "Note: All fields are required"
			this.toggleErrorString = true
			this._snackBar.open("Note: All fields are required", '\u2716')
		}
	}
}
