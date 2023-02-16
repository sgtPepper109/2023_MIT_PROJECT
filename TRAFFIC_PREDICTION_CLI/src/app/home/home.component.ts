import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Operation } from '../services/operationService/operation'
import { OperationService } from '../services/operationService/operation.service';
import { PropService } from '../services/propService/prop.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { FlaskService } from '../services/flaskService/flask.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
	constructor(
		private router: Router,
		private operationService: OperationService,
		private propService: PropService,
		private _snackBar: MatSnackBar,
		private ngxCsvParser: NgxCsvParser,
		private flaskService: FlaskService
	) {}

	public operations: Operation[] = [];

	csvRecords: object = {}
	header: boolean = true
	fileName: string = ""
	datasetPath: string = ""

	// declaring all the input field variables with help of ngModel
	dataset: string = ""
	inputTrainRatio: string = ""
	inputTestRatio: string = ""

	// error message to be displayed on the screen
	errorstring: string = ""

	// for displaying if validations are not correct
	toggleErrorString: boolean = false;
	start: boolean = false

	ngOnInit() {}

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

	fileChangeListener($event: any): void {
		
		const files = $event.srcElement.files;
		this.fileName = files[0]['name']
		this.header = (this.header as unknown as string) === 'true' || this.header === true;

		const arr = this.fileName.split('.')
		if (arr[arr.length - 1] === 'csv' || arr[arr.length - 1] === 'data' || arr[arr.length - 1] === 'xlsx') {

		this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',', encoding: 'utf8' })
			.pipe().subscribe({
				next: (result): void => {
					this.csvRecords = Object.values(result);

					this.flaskService.sendCsvData(result).subscribe()
				},
				error: (error: NgxCSVParserError): void => {
					console.log('Error', error);
				}
			});
		} else {
			this.errorstring = "Note: Incorrect file type (Please choose a .csv, or a .xlsx or a .data file"
			this.toggleErrorString = true
			this._snackBar.open("Note: Incorrect file type (Please choose a .csv, or a .xlsx or a .data file", 'x') 
		}
	}


	reset() {
		this.inputTrainRatio = ""
		this.inputTestRatio = ""
		this.dataset = ""
		this.csvRecords = {}
	}


	manageInfo() {

		if (this.dataset !== "" && this.inputTestRatio !== "" && this.inputTrainRatio !== "") {
			const trainRatio = parseFloat(this.inputTrainRatio)
			const testRatio = parseFloat(this.inputTestRatio)

			const datasetString = this.dataset
			const arr = datasetString.split('.')
			if (arr[arr.length - 1] === 'csv' || arr[arr.length - 1] === 'data' || arr[arr.length - 1] === 'xlsx') {

				if (trainRatio + testRatio === 1.0 && testRatio < 1) {
					let operation: Operation = {
						dataset: this.dataset,
						trainRatio: trainRatio,
						testRatio: testRatio,
						userId: 1234567890
					}

					this.operationService.addOperation(operation).subscribe(
						(response: Operation) => {
			
							// on success, navigate to page2
							this.flaskService.setData().subscribe(
								(response) => {
		
									this.flaskService.getTableData().subscribe(
										(response) => {
				
											// this is a service file shared with page2 component
											this.propService.data = response
											this.propService.trainRatio = trainRatio
											this.propService.dataset = this.dataset
											this.propService.testRatio = testRatio
				
											// navigate to page2
											this.router.navigate(['/page2'])
										},
										(error: HttpErrorResponse) => {
											console.log(error.message)
											alert(error.message)
				
										}
									)
		
								},
								(error: HttpErrorResponse) => {
									console.log('setDataError', error.message)
									alert(error.message)
								}
							)
						},
						(error: HttpErrorResponse) => {
							this.errorstring = "Note: Error encountered while connecting to server"
							this.toggleErrorString = true
						}
					)

					

					

				} else {
					this.errorstring = "Note: Invalid input ratios (Must be in range of 0 to 1"
					this.toggleErrorString = true
					this._snackBar.open("Note: Invalid input ratios (Must be in range of 0 to 1", '\u2716')
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
