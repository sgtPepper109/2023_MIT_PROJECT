import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flaskService/flask.service';
import { JunctionSpecificsService } from '../services/junctionSpecifics/junction-specifics.service';
import { Router } from '@angular/router';
import { JunctionDistrictMap } from '../services/junctionDistrictMap/junction-district-map';
import { JunctionRoadwayWidthMap } from '../services/junctionRoadwayWidth/junction-roadway-width-map';
import { JunctionMaxVehiclesMap } from '../services/junctionMaxVehiclesMap/junction-max-vehicles-map';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { PropService } from '../services/propService/prop.service';

@Component({
	selector: 'app-admin-inputs',
	templateUrl: './admin-inputs.component.html',
	styleUrls: ['./admin-inputs.component.css']
})
export class AdminInputsComponent implements OnInit {
	constructor(
		public flaskService: FlaskService,
		public propService: PropService,
		public junctionSpecificsService: JunctionSpecificsService,
		private ngxCsvParser: NgxCsvParser,
		public router: Router
	) {
		if (this.queryJunctionDistrict && this.queryJunctionRoadwayWidth && this.queryJunctionMaxVehicles) {
			this.showSubmitButton = true
		}
	}

	currentJunctionForDistrict: string = ""
	currentJunctionForRoadwayWidth: string = ""
	currentJunctionForMaxVehicles: string = ""
	currentJunctionForDistrictIndex: number = 0
	currentJunctionForRoadwayWidthIndex: number = 0
	currentJunctionForMaxVehiclesIndex: number = 0
	statusJunctionDistrict: string = "Next"
	dataset: string = ""
	queryJunctionDistrict: boolean = false
	queryJunctionMaxVehicles: boolean = false
	queryJunctionRoadwayWidth: boolean = false
	showSubmitButton: boolean = false

	junctions: Array<number> = []
	
	roadwayWidthInput: string = ""
	districtInput: string = ""
	maxVehiclesInput: string = ""
	errorString: string = ""
	toggleErrorString: boolean = false
	errorString2: string = ""
	toggleErrorString2: boolean = false
	errorString3: string = ""
	toggleErrorString3: boolean = false
	errorString4: string = ""
	toggleErrorString4: boolean = false
	junctionInputGivenForDistricts: Array<string> = []
	junctionInputGivenForRoadwayWidth: Array<string> = []
	junctionInputGivenForMaxVehicles: Array<string> = []

	junctionDistricts: JunctionDistrictMap[] = []
	junctionRoadwayWidths: JunctionRoadwayWidthMap[] = []
	junctionMaxVehicles: JunctionMaxVehiclesMap[] = []



	ngOnInit(): void {

		this.flaskService.getAllJunctions().subscribe({
			next: (response) => {
				this.junctions = Object.values(response)
				this.currentJunctionForDistrict = this.junctions[this.currentJunctionForDistrictIndex].toString()
				this.currentJunctionForRoadwayWidth = this.junctions[this.currentJunctionForRoadwayWidthIndex].toString()
				this.currentJunctionForMaxVehicles = this.junctions[this.currentJunctionForMaxVehiclesIndex].toString()
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})
	}


	submitToTraining() {
		this.propService.dataset = this.dataset
		console.log(this.dataset)
		if (this.dataset != "") {
			this.router.navigate(['/training'])
		} else {
			this.errorString4 = "Note: Please choose a dataset"
			this.toggleErrorString4 = true
		}
	}



	fileChangeListener($event: any): void {
		
		const files = $event.srcElement.files;
		let fileName = files[0]['name']
		let header: boolean = true
		header = (header as unknown as string) === 'true' || header === true;

		const arr = fileName.split('.')
		if (arr[arr.length - 1] === 'csv' || arr[arr.length - 1] === 'data' || arr[arr.length - 1] === 'xlsx') {

		this.ngxCsvParser.parse(files[0], { header: header, delimiter: ',', encoding: 'utf8' })
			.pipe().subscribe({
				next: (result): void => {
					let csvRecords = Object.values(result);

					this.flaskService.sendCsvData(result).subscribe()
				},
				error: (error: NgxCSVParserError): void => {
					console.log('Error', error);
				}
			});
		} else {
			this.errorString4 = "Note: Incorrect file type (Please choose a .csv, or a .xlsx or a .data file"
			this.toggleErrorString4 = true
		}
	}


	

	nextDistrict() {
		if (this.junctionInputGivenForDistricts.includes(this.currentJunctionForDistrict) == false) {
			let junctionDistrictObj: JunctionDistrictMap = {
				junctionName: this.currentJunctionForDistrict,
				district: this.districtInput
			}
			if (this.districtInput != "") {
				this.junctionDistricts.push(junctionDistrictObj)
				this.junctionInputGivenForDistricts.push(this.currentJunctionForDistrict)
			} else {
				this.errorString = "Enter District"
				this.toggleErrorString = true
			}
		} else {
			for (let element of this.junctionDistricts) {
				if (element.junctionName == this.currentJunctionForDistrict) {
					this.districtInput = element.district
					element.district = this.districtInput
				}
			}
		}
		if (this.currentJunctionForDistrictIndex == this.junctions.length -1) {
			this.statusJunctionDistrict = "Save"
			this.errorString = "Note: No More Junctions"
			this.toggleErrorString = true


			this.junctionSpecificsService.addJunctionDistrictMap(this.junctionDistricts).subscribe({
				next: (response) => {
					this.queryJunctionDistrict = true
					if (this.queryJunctionDistrict && this.queryJunctionRoadwayWidth && this.queryJunctionMaxVehicles) {
						this.showSubmitButton = true
					}
				},
				error: (error: HttpErrorResponse) => {
					console.log(error)
					alert(error.message)
				}
			})


		} else {
			this.currentJunctionForDistrictIndex ++
			this.currentJunctionForDistrict = this.junctions[this.currentJunctionForDistrictIndex].toString()
		}


		this.districtInput = ""


	}

	previousDistrict() {
		if (this.junctionInputGivenForDistricts.includes(this.currentJunctionForDistrict) == false) {
			let junctionDistrictObj: JunctionDistrictMap = {
				junctionName: this.currentJunctionForDistrict,
				district: this.districtInput
			}
			if (this.districtInput != "") {
				this.junctionDistricts.push(junctionDistrictObj)
			}
		} else {
			for (let element of this.junctionDistricts) {
				if (element.junctionName == this.currentJunctionForDistrict) {
					this.districtInput = element.district
					element.district = this.districtInput
				}
			}
		}
		if (this.currentJunctionForDistrictIndex == 0) {
			this.errorString = "Note: No More Junctions"
			this.toggleErrorString = true
		} else {
			this.currentJunctionForDistrictIndex --
			this.currentJunctionForDistrict = this.junctions[this.currentJunctionForDistrictIndex].toString()
		}
	}




	nextRoadwayWidth() {
		if (this.junctionInputGivenForRoadwayWidth.includes(this.currentJunctionForRoadwayWidth) == false) {
			let junctionRoadwayWidthObject: JunctionRoadwayWidthMap = {
				junctionName: this.currentJunctionForRoadwayWidth,
				roadwayWidth: this.roadwayWidthInput
			}
			if (this.roadwayWidthInput!= "") {
				this.junctionRoadwayWidths.push(junctionRoadwayWidthObject)
				this.junctionInputGivenForRoadwayWidth.push(this.currentJunctionForRoadwayWidth)
			} else {
				this.errorString2 = "Enter Roadway Width"
				this.toggleErrorString2 = true
			}
		} else {
			for (let element of this.junctionRoadwayWidths) {
				if (element.junctionName == this.currentJunctionForRoadwayWidth) {
					this.roadwayWidthInput = element.roadwayWidth
					element.roadwayWidth = this.roadwayWidthInput
				}
			}
		}
		if (this.currentJunctionForRoadwayWidthIndex == 3) {
			this.errorString2 = "Note: No More Junctions"
			this.toggleErrorString2 = true


			this.junctionSpecificsService.addJunctionRoadwayWidthMap(this.junctionRoadwayWidths).subscribe({
				next: (response) => {
					this.queryJunctionRoadwayWidth = true
					if (this.queryJunctionDistrict && this.queryJunctionRoadwayWidth && this.queryJunctionMaxVehicles) {
						this.showSubmitButton = true
					}
				},
				error: (error: HttpErrorResponse) => {
					console.log(error)
					alert(error.message)
				}
			})


		} else {
			this.currentJunctionForRoadwayWidthIndex ++
			this.currentJunctionForRoadwayWidth = this.junctions[this.currentJunctionForRoadwayWidthIndex].toString()
		}


		this.roadwayWidthInput= ""

	}


	previousRoadwayWidth() {
		if (this.junctionInputGivenForRoadwayWidth.includes(this.currentJunctionForRoadwayWidth) == false) {
			let junctionRoadwayWidthObject: JunctionRoadwayWidthMap = {
				junctionName: this.currentJunctionForRoadwayWidth,
				roadwayWidth: this.roadwayWidthInput
			}
			if (this.roadwayWidthInput != "") {
				this.junctionRoadwayWidths.push(junctionRoadwayWidthObject)
			}
		} else {
			for (let element of this.junctionRoadwayWidths) {
				if (element.junctionName == this.currentJunctionForRoadwayWidth) {
					this.roadwayWidthInput = element.roadwayWidth
					element.roadwayWidth= this.roadwayWidthInput
				}
			}
		}
		if (this.currentJunctionForRoadwayWidthIndex == 0) {
			this.errorString2 = "Note: No More Junctions"
			this.toggleErrorString2 = true
		} else {
			this.currentJunctionForRoadwayWidthIndex --
			this.currentJunctionForRoadwayWidth = this.junctions[this.currentJunctionForRoadwayWidthIndex].toString()
		}
	}





	nextMaxVehicles() {
		if (this.junctionInputGivenForMaxVehicles.includes(this.currentJunctionForMaxVehicles) == false) {
			let junctionMaxVehiclesObject: JunctionMaxVehiclesMap = {
				junctionName: this.currentJunctionForMaxVehicles,
				maxVehicles: this.maxVehiclesInput
			}
			if (this.maxVehiclesInput!= "") {
				this.junctionMaxVehicles.push(junctionMaxVehiclesObject)
				this.junctionInputGivenForMaxVehicles.push(this.currentJunctionForMaxVehicles)
			} else {
				this.errorString3 = "Enter MaxVehicles"
				this.toggleErrorString3 = true
			}
		} else {
			for (let element of this.junctionMaxVehicles) {
				if (element.junctionName == this.currentJunctionForMaxVehicles) {
					this.maxVehiclesInput = element.maxVehicles
					element.maxVehicles = this.maxVehiclesInput
				}
			}
		}
		if (this.currentJunctionForMaxVehiclesIndex == 3) {
			this.errorString3 = "Note: No More Junctions"
			this.toggleErrorString3 = true


			this.junctionSpecificsService.addJunctionMaxVehiclesMap(this.junctionMaxVehicles).subscribe({
				next: (response) => {
					this.queryJunctionMaxVehicles = true
					if (this.queryJunctionDistrict && this.queryJunctionRoadwayWidth && this.queryJunctionMaxVehicles) {
						this.showSubmitButton = true
					}
				},
				error: (error: HttpErrorResponse) => {
					console.log(error)
					alert(error.message)
				}
			})



		} else {
			this.currentJunctionForMaxVehiclesIndex ++
			this.currentJunctionForMaxVehicles = this.junctions[this.currentJunctionForMaxVehiclesIndex].toString()
		}

		this.maxVehiclesInput= ""

	}


	previousMaxVehicles() {
		if (this.junctionInputGivenForMaxVehicles.includes(this.currentJunctionForMaxVehicles) == false) {
			let junctionMaxVehiclesObject: JunctionMaxVehiclesMap = {
				junctionName: this.currentJunctionForMaxVehicles,
				maxVehicles: this.maxVehiclesInput
			}
			if (this.maxVehiclesInput != "") {
				this.junctionMaxVehicles.push(junctionMaxVehiclesObject)
			}
		} else {
			for (let element of this.junctionMaxVehicles) {
				if (element.junctionName == this.currentJunctionForMaxVehicles) {
					this.maxVehiclesInput = element.maxVehicles
					element.maxVehicles = this.maxVehiclesInput
				}
			}
		}
		if (this.currentJunctionForMaxVehiclesIndex == 0) {
			this.errorString3 = "Note: No More Junctions"
			this.toggleErrorString3 = true
		} else {
			this.currentJunctionForMaxVehiclesIndex --
			this.currentJunctionForMaxVehicles = this.junctions[this.currentJunctionForMaxVehiclesIndex].toString()
		}
	}






	navigateToTraining() {
		this.router.navigate(['/training']);
	}
	
	navigateToPredictions() {
		this.router.navigate(['/prediction']);
	}
	
}
