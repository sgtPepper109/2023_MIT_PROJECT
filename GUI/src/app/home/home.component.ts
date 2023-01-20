import { Component, EventEmitter, isDevMode, NgModule, Output } from '@angular/core';
import { createPool, Pool } from 'mysql'
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Operation } from '../operation';
import { OperationService } from '../operation.service';
import { response } from 'express';

let pool: Pool;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent {
	constructor(private router: Router, private operationService: OperationService) { }

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

	// get operations functionality to test
	public getOperations(): void {
		this.operationService.getOperations().subscribe(
			(response: Operation[]) => {
				this.operations = response
				console.log(this.operations)
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
				console.log(response)
				
				// on success, navigate to page2
				this.getOperations()
				this.router.navigate(['/page2'])
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

			} else {
				this.errorstring = "Note: The ratios don't add up to 1"
				this.toggleErrorString = true
			}
		} else {
			this.errorstring = "Note: All fields are required"
			this.toggleErrorString = true
		}
	}
}
