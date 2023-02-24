import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flaskService/flask.service';
import { JunctionSpecificsService } from '../services/junctionSpecifics/junction-specifics.service';
import { Router } from '@angular/router';
import { JunctionDistrictMap } from '../services/junctionDistrictMap/junction-district-map';
import { JunctionRoadwayWidthMap } from '../services/junctionRoadwayWidth/junction-roadway-width-map';
import { JunctionMaxVehiclesMap } from '../services/junctionMaxVehiclesMap/junction-max-vehicles-map';

@Component({
	selector: 'app-admin-inputs',
	templateUrl: './admin-inputs.component.html',
	styleUrls: ['./admin-inputs.component.css']
})
export class AdminInputsComponent implements OnInit {
	constructor(
		public flaskService: FlaskService,
		public junctionSpecificsService: JunctionSpecificsService,
		public router: Router
	) {
	}

	currentJunctionForDistrict: string = ""
	currentJunctionForRoadwayWidth: string = ""
	currentJunctionForMaxVehicles: string = ""
	currentJunctionForDistrictIndex: number = 0
	currentJunctionForRoadwayWidthIndex: number = 0
	currentJunctionForMaxVehiclesIndex: number = 0
	statusJunctionDistrict: string = "Next"

	junctions: Array<number> = []
	
	roadwayWidthInput: string = ""
	districtInput: string = ""
	maxVehiclesInput: string = ""
	errorString: string = ""
	toggleErrorString: boolean = false
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
					console.log(response)
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
		console.log(this.currentJunctionForDistrict)
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
		console.log(this.junctionDistricts)
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
				this.errorString = "Enter District"
				this.toggleErrorString = true
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
			this.errorString = "Note: No More Junctions"
			this.toggleErrorString = true

			console.log(this.junctionRoadwayWidths)

			this.junctionSpecificsService.addJunctionRoadwayWidthMap(this.junctionRoadwayWidths).subscribe({
				next: (response) => {
					console.log(response)
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
			this.errorString = "Note: No More Junctions"
			this.toggleErrorString = true
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
				this.errorString = "Enter District"
				this.toggleErrorString = true
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
			this.errorString = "Note: No More Junctions"
			this.toggleErrorString = true


			this.junctionSpecificsService.addJunctionMaxVehiclesMap(this.junctionMaxVehicles).subscribe({
				next: (response) => {
					console.log(response)
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
			this.errorString = "Note: No More Junctions"
			this.toggleErrorString = true
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
