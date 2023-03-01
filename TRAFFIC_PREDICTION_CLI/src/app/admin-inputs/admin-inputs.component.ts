import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flaskService/flask.service';
import { JunctionSpecificsService } from '../services/junctionSpecifics/junction-specifics.service';
import { Router } from '@angular/router';
import { JunctionDistrictMap } from '../services/junctionDistrictMap/junction-district-map';
import { JunctionRoadwayWidthMap } from '../services/junctionRoadwayWidth/junction-roadway-width-map';
import { RoadwayWidthMaxVehiclesMap } from '../services/roadwayWidth-maxVehicles-map/roadwayWidth-maxVehicles-map';
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
	) {}

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
	saveJunctionDistrictButton: boolean = false
	saveJunctionRoadwayWidthButton: boolean = false
	showSubmitButton: boolean = false
	districtList: Array<string> = []
	roadwayWidthList: Array<string> = []
	savedJunctionDistricts: boolean = false
	savedJunctionRoadwayWidths: boolean = false
	savedRoadwayWidthMaxVehicles: boolean = false

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
	junctionDistrictMaps: Map<string, string> = new Map()
	junctionRoadwayWidths: JunctionRoadwayWidthMap[] = []
	junctionRoadwayWidthMaps: Map<string, number> = new Map()
	roadwayWidthMaxVehicles: RoadwayWidthMaxVehiclesMap[] = []
	roadwayWidthMaxVehiclesMaps: Map<number, number> = new Map()



	ngOnInit(): void {

		this.junctionSpecificsService.cleanJuntionSpecificTables().subscribe({
			next: (response) => {
				console.log(response)
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})

		this.flaskService.getAllJunctions().subscribe({
			next: (response) => {
				this.junctions = Object.values(response)
				this.propService.junctions = this.junctions
				this.currentJunctionForDistrict = this.junctions[this.currentJunctionForDistrictIndex].toString()
				this.currentJunctionForRoadwayWidth = this.junctions[this.currentJunctionForRoadwayWidthIndex].toString()
				this.currentJunctionForMaxVehicles = this.junctions[this.currentJunctionForMaxVehiclesIndex].toString()
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})


		this.junctionSpecificsService.getAllDistricts().subscribe({
			next: (response) => {
				for (const element of Object.values(response)) {
					this.districtList.push(element.name)
				}
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})


		this.junctionSpecificsService.getAllRoadwayWidths().subscribe({
			next: (response) => {
				for (const element of Object.values(response)) {
					this.roadwayWidthList.push(element.roadway_width)
				}

			},
			error: (error: HttpErrorResponse) => {

			}
		})


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


	
	trackDistrict(param1: string, param2: string) {
		this.junctionDistrictMaps.set(param1, param2)
		if (this.junctionDistrictMaps.size === this.junctions.length) {
			this.saveJunctionDistrictButton = true
		}
	}

	trackRoadwayWidth(param1: string, param2: number) {
		this.junctionRoadwayWidthMaps.set(param1, param2)
		if (this.junctionRoadwayWidthMaps.size === this.junctions.length) {
			this.saveJunctionRoadwayWidthButton = true	
		}
	}


	trackMaxVehicles(param1: string, param2: string) {
		let roadwayWidth = parseInt(param1)
		let maxVehicles = parseInt(param2)
		this.roadwayWidthMaxVehiclesMaps.set(roadwayWidth, maxVehicles)
	}

	

	saveJunctionDistrictMaps() {
		for (let [key, value] of this.junctionDistrictMaps) {
			let junctionDistrictObject: JunctionDistrictMap = {
				junctionName: key,
				district: value
			}
			this.junctionDistricts.push(junctionDistrictObject)
		}

		this.junctionSpecificsService.addJunctionDistrictMap(this.junctionDistricts).subscribe({
			next: (response) => {
				this.savedJunctionDistricts = true
				if (this.savedJunctionDistricts && this.savedJunctionRoadwayWidths && this.savedRoadwayWidthMaxVehicles) {
					this.showSubmitButton = true
				}
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})


	}

	saveJunctionRoadwayWidthMaps() {
		for (let [key, value] of this.junctionRoadwayWidthMaps) {
			let junctionRoadwayWidthObject: JunctionRoadwayWidthMap = {
				junctionName: key,
				roadwayWidth: value
			}
			this.junctionRoadwayWidths.push(junctionRoadwayWidthObject)
		}
		this.junctionSpecificsService.addJunctionRoadwayWidthMap(this.junctionRoadwayWidths).subscribe({
			next: (response) => {
				this.savedJunctionRoadwayWidths = true
				if (this.savedJunctionDistricts && this.savedJunctionRoadwayWidths && this.savedRoadwayWidthMaxVehicles) {
					this.showSubmitButton = true
				}
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})
	}


	saveRoadwayWidthMaxVehiclesMaps() {
		if (this.roadwayWidthMaxVehiclesMaps.size === this.roadwayWidthList.length) {
			this.toggleErrorString3 = false
			for (let [key, value] of this.roadwayWidthMaxVehiclesMaps) {
				let roadwayWidthMaxVehiclesObject: RoadwayWidthMaxVehiclesMap = {
					roadwayWidth: key,
					maxVehicles: value
				}
				this.roadwayWidthMaxVehicles.push(roadwayWidthMaxVehiclesObject)
			}

			this.junctionSpecificsService.addRoadwayWidthMaxVehiclesMap(this.roadwayWidthMaxVehicles).subscribe({
				next: (response) => {
					this.savedRoadwayWidthMaxVehicles = true
					if (this.savedJunctionDistricts && this.savedJunctionRoadwayWidths && this.savedRoadwayWidthMaxVehicles) {
						this.showSubmitButton = true
					}
				},
				error: (error: HttpErrorResponse) => {
					console.log(error)
					alert(error.message)
				}
			})

		} else {
			this.errorString3 = "Note: Please fill in all the fields"
			this.toggleErrorString3 = true
		}
	}


	submitToTraining() {
		this.propService.dataset = this.dataset
		if (this.dataset != "") {
			this.router.navigate(['/training'])
		} else {
			this.errorString4 = "Note: Please choose a dataset"
			this.toggleErrorString4 = true
		}
	}




	// nextMaxVehicles() {
	// 	if (this.junctionInputGivenForMaxVehicles.includes(this.currentJunctionForMaxVehicles) == false) {
	// 		let junctionMaxVehiclesObject: RoadwayWidthMaxVehiclesMap= {
	// 			junctionName: this.currentJunctionForMaxVehicles,
	// 			maxVehicles: this.maxVehiclesInput
	// 		}
	// 		if (this.maxVehiclesInput!= "") {
	// 			this.junctionMaxVehicles.push(junctionMaxVehiclesObject)
	// 			this.junctionInputGivenForMaxVehicles.push(this.currentJunctionForMaxVehicles)
	// 		} else {
	// 			this.errorString3 = "Enter MaxVehicles"
	// 			this.toggleErrorString3 = true
	// 		}
	// 	} else {
	// 		for (let element of this.junctionMaxVehicles) {
	// 			if (element.junctionName == this.currentJunctionForMaxVehicles) {
	// 				this.maxVehiclesInput = element.maxVehicles
	// 				element.maxVehicles = this.maxVehiclesInput
	// 			}
	// 		}
	// 	}
	// 	if (this.currentJunctionForMaxVehiclesIndex == 3) {
	// 		this.errorString3 = "Note: No More Junctions"
	// 		this.toggleErrorString3 = true


	// 		this.junctionSpecificsService.addJunctionMaxVehiclesMap(this.junctionMaxVehicles).subscribe({
	// 			next: (response) => {
	// 				this.queryJunctionMaxVehicles = true
	// 				if (this.queryJunctionDistrict && this.queryJunctionRoadwayWidth && this.queryJunctionMaxVehicles) {
	// 					this.showSubmitButton = true
	// 				}
	// 			},
	// 			error: (error: HttpErrorResponse) => {
	// 				console.log(error)
	// 				alert(error.message)
	// 			}
	// 		})



	// 	} else {
	// 		this.currentJunctionForMaxVehiclesIndex ++
	// 		this.currentJunctionForMaxVehicles = this.junctions[this.currentJunctionForMaxVehiclesIndex].toString()
	// 	}

	// 	this.maxVehiclesInput= ""

	// }


	// previousMaxVehicles() {
	// 	if (this.junctionInputGivenForMaxVehicles.includes(this.currentJunctionForMaxVehicles) == false) {
	// 		let junctionMaxVehiclesObject: RoadwayWidthMaxVehiclesMap = {
	// 			junctionName: this.currentJunctionForMaxVehicles,
	// 			maxVehicles: this.maxVehiclesInput
	// 		}
	// 		if (this.maxVehiclesInput != "") {
	// 			this.junctionMaxVehicles.push(junctionMaxVehiclesObject)
	// 		}
	// 	} else {
	// 		for (let element of this.junctionMaxVehicles) {
	// 			if (element.junctionName == this.currentJunctionForMaxVehicles) {
	// 				this.maxVehiclesInput = element.maxVehicles
	// 				element.maxVehicles = this.maxVehiclesInput
	// 			}
	// 		}
	// 	}
	// 	if (this.currentJunctionForMaxVehiclesIndex == 0) {
	// 		this.errorString3 = "Note: No More Junctions"
	// 		this.toggleErrorString3 = true
	// 	} else {
	// 		this.currentJunctionForMaxVehiclesIndex --
	// 		this.currentJunctionForMaxVehicles = this.junctions[this.currentJunctionForMaxVehiclesIndex].toString()
	// 	}
	// }






	navigateToTraining() {
		this.router.navigate(['/training']);
	}
	
	navigateToPredictions() {
		this.router.navigate(['/prediction']);
	}
	
}
