import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flaskService/flask.service';
import { JunctionSpecificsService } from '../services/junctionSpecifics/junction-specifics.service';
import { Router } from '@angular/router';
import { JunctionDistrictMap } from '../services/junctionDistrictMap/junction-district-map';
import { JunctionRoadwayWidthMap } from '../services/junctionRoadwayWidth/junction-roadway-width-map';
import { RoadwayWidthMaxVehiclesMap } from '../services/roadwayWidth-maxVehicles-map/roadwayWidth-maxVehicles-map';
import { NgxCsvParser } from 'ngx-csv-parser';
import { PropService } from '../services/propService/prop.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
		public router: Router,
		private _snackBar: MatSnackBar
	) {}

	currentJunctionForDistrict: string = ""
	currentJunctionForRoadwayWidth: string = ""
	currentJunctionForMaxVehicles: string = ""
	currentJunctionForDistrictIndex: number = 0
	currentJunctionForRoadwayWidthIndex: number = 0
	currentJunctionForMaxVehiclesIndex: number = 0
	statusJunctionDistrict: string = "Next"
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
				console.log('cleaned')
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


	showData() {
		if (this.savedJunctionDistricts && this.savedJunctionRoadwayWidths && this.savedRoadwayWidthMaxVehicles) {
			this.showSubmitButton = true
		}

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
				this._snackBar.open('Records Saved Successfully', '\u2716')
				this.showData()
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
				this._snackBar.open('Records Saved Successfully', '\u2716')
				this.showData()
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
					this._snackBar.open('Records Saved Successfully', '\u2716')
					this.showData()
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
		this.router.navigate(['/training'])
	}




	navigateToTraining() {
		this.router.navigate(['/training']);
	}
	
	navigateToPredictions() {
		this.router.navigate(['/prediction']);
	}
	
}
