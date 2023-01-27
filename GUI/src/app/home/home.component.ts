import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Operation } from '../services/operationService/operation'
import { OperationService } from '../services/operationService/operation.service';
import { PropService } from '../services/propService/prop.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ngxCsv } from 'ngx-csv';
import { FlaskService } from '../services/flaskService/flask.service';


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
		private _snackBar: MatSnackBar,
		private ngxCsvParser: NgxCsvParser,
		private flaskService: FlaskService
	) {}

	public operations: Operation[] = [];

	csvRecords: any
	header = true
	fileName = ""
	datasetPath = ""

	fileChangeListener($event: any): void {

		const files = $event.srcElement.files;
		this.fileName = files[0]['name']
		this.header = (this.header as unknown as string) === 'true' || this.header === true;

		var arr = this.fileName.split('.')
			if (arr[arr.length - 1] === 'csv' || arr[arr.length - 1] === 'data' || arr[arr.length - 1] === 'xlsx') {

			this.ngxCsvParser.parse(files[0], { header: this.header, delimiter: ',', encoding: 'utf8' })
				.pipe().subscribe({
					next: (result): void => {
						console.log('Result', Object.values(result)[0]);
						this.csvRecords = Object.values(result);
						var options = { 
							fieldSeparator: ',',
							quoteStrings: '',
							decimalseparator: '.',
							showLabels: true,
							useBom: true,
							noDownload: false,
							headers: Object.keys(Object.values(result)[0])
						};
						new ngxCsv(this.csvRecords, this.fileName.split('.')[0], options);
						this.datasetPath = "C:/Users/Acer/Downloads/" + this.fileName
						console.log(this.datasetPath)
						this.dataset = this.datasetPath
						// this.dataset = "C:/Users/Acer/Downloads/" + this.fileName
						// new ngxCsv(this.csvRecords, 'C:/Users/Acer/programs/temp')
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
			if (arr[arr.length - 1] === 'csv' || arr[arr.length - 1] === 'data' || arr[arr.length - 1] === 'xlsx') {

				if (trainratio + testratio + valratio === 1.0) {
					console.log(this.dataset, ' ', this.inputtrainratio, this.inputtestratio, this.inputvalratio)
					console.log((<HTMLInputElement>document.getElementById('myfile')).files)

					// Create an object of type Operation specified in ../operation.ts to pass it to backend
					let operation: Operation = {
						dataset: this.dataset,
						trainratio: trainratio,
						testratio: testratio,
						valratio: valratio,
						user_id: 1234567890
					}

					this.addOperation(operation)

					this.flaskService.setData().subscribe(
						(response) => {
							console.log('setData', response)

							this.flaskService.getTableData().subscribe(
								(response) => {
									console.log('getTableData', this.propService.data)
									console.log('response: ', response)
									console.log('this.propservice.data: ', this.propService.data)
		
									// this is a service file shared with page2 component
									// this.propService.data = {}
									this.propService.data = response
		
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
