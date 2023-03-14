import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flaskService/flask.service';
import { JunctionSpecificsService } from '../services/junctionSpecificsService/junction-specifics.service';
import { Router } from '@angular/router';
import { JunctionDistrictMap } from '../interfaces/junctionDistrictMap/junction-district-map';
import { JunctionRoadwayWidthMap } from '../interfaces/junctionRoadwayWidth/junction-roadway-width-map';
import { RoadwayWidthMaxVehiclesMap } from '../interfaces/roadwayWidth-maxVehicles-map/roadwayWidth-maxVehicles-map';
import { NgxCsvParser } from 'ngx-csv-parser';
import { PropService } from '../services/propService/prop.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JunctionInformation } from '../interfaces/junctionInformation/junction-information';

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
		public router: Router,
		private _snackBar: MatSnackBar
	) {}

	recordToBeDeleted: any = {}
	newJunctionName: string = ""
	newDistrict: string = ""
	newRoadwayWidth: number = 0
	newMaxVehicles: number = 0
	updatedDistrict: string = ""
	updatedRoadwayWidth: number = 0
	updatedMaxVehicles: number = 0
	recordToBeEdited: any = {}
	junctions: Array<string> = []
	junctionDistrictMaps: Map<string, string> = new Map();
	junctionRoadwayWidthMaps: Map<string, number> = new Map();
	roadwayWidthMaxVehiclesMaps: Map<number, number> = new Map();
	allJunctionsInformation: Array<JunctionInformation> = []
	allJunctionDistrictMaps: Array<JunctionDistrictMap> = []
	allJunctionRoadwayWidthMaps: Array<JunctionRoadwayWidthMap> = []
	allRoadwayWidthMaxVehiclesMaps: Array<RoadwayWidthMaxVehiclesMap> = []
	allDistricts: Array<string> = []
	allRoadwayWidths: Array<number> = []

	ngOnInit(): void {
		this.junctionSpecificsService.getAllJunctions().subscribe({
			next: (response) => {
				this.junctions = Object.values(response)


				this.junctionSpecificsService.getAllDistricts().subscribe({
					next: (response) => {
						for (let element of Object.values(response)) {
							this.allDistricts.push(element.name)
						}
					},
					error: (error: HttpErrorResponse) => {
						console.log(error)
						alert(error.message)
					}
				})

				this.junctionSpecificsService.getAllRoadwayWidths().subscribe({
					next: (response) => {
						for (let element of Object.values(response)) {
							this.allRoadwayWidths.push(element.roadway_width)
						}
					},
					error: (error: HttpErrorResponse) => {
						console.log(error)
						alert(error.message)
					}
				})

				this.getAllJunctionSpecificDataFromDB();

			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})
	}


	getAllJunctionSpecificDataFromDB() {
		this.junctionSpecificsService.getAllJunctionDistrictMaps().subscribe({
			next: (response) => {
				this.junctionDistrictMaps.clear()
				this.allJunctionDistrictMaps = Object.values(response)
				for (let element of Object.values(response)) {
					this.junctionDistrictMaps.set(element.junctionName, element.district)
				}

				this.junctionSpecificsService.getAllJunctionRoadwayWidthMaps().subscribe({
					next: (response) => {
						this.junctionRoadwayWidthMaps.clear()
						this.allJunctionRoadwayWidthMaps = Object.values(response)
						for (let element of Object.values(response)) {
							this.junctionRoadwayWidthMaps.set(element.junctionName, element.roadwayWidth)
						}

						this.junctionSpecificsService.getAllRoadwayWidthMaxVehiclesMaps().subscribe({
							next: (response) => {
								this.roadwayWidthMaxVehiclesMaps.clear()
								this.allRoadwayWidthMaxVehiclesMaps = Object.values(response)
								for (let element of Object.values(response)) {
									this.roadwayWidthMaxVehiclesMaps.set(element.roadwayWidth, element.maxVehicles)
								}

								this.allJunctionsInformation = []
								for (let[key, value] of this.junctionDistrictMaps) {
									let junctionInformation: JunctionInformation = {
										junctionName: key,
										district: this.junctionDistrictMaps.get(key)!,
										roadwayWidth: this.junctionRoadwayWidthMaps.get(key)!,
										maxVehicles: this.roadwayWidthMaxVehiclesMaps.get( this.junctionRoadwayWidthMaps.get(key)! )!
									}
									this.allJunctionsInformation.push(junctionInformation)
								}

							},
							error: (error: HttpErrorResponse) => {
								console.log(error)
								alert(error.message)
							}
						})

					},
					error: (error: HttpErrorResponse) => {
						console.log(error)
						alert(error.message)
					}
				})

			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})
	}


	navigateToTraining() {
		this.router.navigate(['/training'])
	}
	navigateToPredictions() {
		this.router.navigate(['/prediction'])
	}


	editRecord(record: JunctionInformation) {
		this.recordToBeEdited = record
	}

	addRecord() {

		let newJunctionInformation: JunctionInformation = {
			junctionName: this.newJunctionName,
			district: this.newDistrict,
			roadwayWidth: this.newRoadwayWidth,
			maxVehicles: this.newMaxVehicles
		}

		let newJunctionDistrictMap: JunctionDistrictMap = {
			junctionName: this.newJunctionName,
			district: this.newDistrict
		}

		let newJunctionRoadwayWidthMap: JunctionRoadwayWidthMap = {
			junctionName: this.newJunctionName,
			roadwayWidth: this.newRoadwayWidth
		}

		let newRoadwayWidthMaxVehiclesMap: RoadwayWidthMaxVehiclesMap = {
			roadwayWidth: this.newRoadwayWidth,
			maxVehicles: this.newMaxVehicles
		}


		this.allJunctionDistrictMaps.push(newJunctionDistrictMap)
		this.allJunctionRoadwayWidthMaps.push(newJunctionRoadwayWidthMap)
		this.allRoadwayWidthMaxVehiclesMaps.push(newRoadwayWidthMaxVehiclesMap)

		this.junctionSpecificsService.addSingleJunctionDistrictMap(newJunctionDistrictMap).subscribe({
			next: (response) => {
				this.junctionSpecificsService.addSingleJunctionRoadwayWidthMap(newJunctionRoadwayWidthMap).subscribe({
					next: (response) => {
						this.junctionSpecificsService.addSingleRoadwayWidthMaxVehiclesMap(newRoadwayWidthMaxVehiclesMap).subscribe({
							next: (response) => {
								this.allJunctionsInformation.push(newJunctionInformation)
								this._snackBar.open('Added Record Successfully', '\u2716')
							},
							error: (error: HttpErrorResponse) => {
								console.log(error)
								alert(error.message)
							}
						})
					},
					error: (error: HttpErrorResponse) => {
						console.log(error)
						alert(error.message)
					}
				})
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})

	}


	update() {
		let updatedJunctionInformation: JunctionInformation = {
			junctionName: this.recordToBeEdited.junctionName,
			district: this.updatedDistrict,
			roadwayWidth: this.updatedRoadwayWidth,
			maxVehicles: this.updatedMaxVehicles
		}

		let updatedJunctionDistrictMap: JunctionDistrictMap = {
			junctionName: this.recordToBeEdited.junctionName,
			district: this.updatedDistrict
		}

		let updatedJunctionRoadwayWidthMap: JunctionRoadwayWidthMap = {
			junctionName: this.recordToBeEdited.junctionName,
			roadwayWidth: this.updatedRoadwayWidth
		}

		let updatedRoadwayWidthMaxVehiclesMap: RoadwayWidthMaxVehiclesMap = {
			roadwayWidth: this.updatedRoadwayWidth,
			maxVehicles: this.updatedMaxVehicles
		}

		this.junctionSpecificsService.updateJunctionDistrictMap(updatedJunctionDistrictMap).subscribe({
			next: (response) => {
				this.junctionSpecificsService.updateJunctionRoadwayWidthMap(updatedJunctionRoadwayWidthMap).subscribe({
					next: (response) => {
						this.junctionSpecificsService.updateRoadwayWidthMaxVehiclesMap(updatedRoadwayWidthMaxVehiclesMap).subscribe({
							next: (response) => {
								this.getAllJunctionSpecificDataFromDB()
								this._snackBar.open('Updated Fields Successfully', '\u2716')
							},
							error: (error: HttpErrorResponse) => {
								console.log(error)
								alert(error.message)
							}
						})
					},
					error: (error: HttpErrorResponse) => {
						console.log(error)
						alert(error.message)
					}
				})
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})
	}


	async deleteFromDB(record: any) {
		let deletePromise = new Promise((resolve, reject) => {
			this.junctionSpecificsService.deleteJunctionDistrictMap(record.junctionName).subscribe({
				next: (response) => {
					this.junctionSpecificsService.deleteJunctionRoadwayWidthMap(record.junctionName).subscribe({
						next: (response) => {
							this.junctionSpecificsService.deleteRoadwayWidthMaxVehiclesMap(record.roadwayWidth).subscribe({
								next: (response) => {
									this.allJunctionsInformation = []
									resolve('deletedFromDB')
								},
								error: (error: HttpErrorResponse) => {
									console.log(error)
									alert(error.message)
								}
							})
						},
						error: (error: HttpErrorResponse) => {
							console.log(error)
							alert(error.message)
						}
					})
				},
				error: (error: HttpErrorResponse) => {
					console.log(error)
					alert(error.message)
				}
			})
		})
		return deletePromise
	}

	delete(record: any) {
		this.deleteFromDB(record).then(() => {
			this.getAllJunctionSpecificDataFromDB()
		})
	}

}
