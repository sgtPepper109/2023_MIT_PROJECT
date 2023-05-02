import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flaskService/flask.service';
import { JunctionSpecificsService } from '../services/db/junctionSpecifics/junction-specifics.service';
import { Router } from '@angular/router';
import { JunctionDistrictMap, JunctionRoadwayWidthMap, RoadwayWidthMaxPcuMap, JunctionInformation } from '../interfaces/all-interfaces';
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
		public router: Router,
		private _snackBar: MatSnackBar,
		private ngxCsvParser: NgxCsvParser,
	) {}

	recordsFile: string = ""
	errorString: string = ""
	toggleSuccessToast: boolean = false
	toggleWarningToast: boolean = false
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
	allRoadwayWidthMaxVehiclesMaps: Array<RoadwayWidthMaxPcuMap> = []
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
						alert(error.message)
					}
				})

				this.getAllJunctionSpecificDataFromDB();

			},
			error: (error: HttpErrorResponse) => {
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
								alert(error.message)
							}
						})

					},
					error: (error: HttpErrorResponse) => {
						alert(error.message)
					}
				})

			},
			error: (error: HttpErrorResponse) => {
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
		this.updatedDistrict = this.recordToBeEdited.district
		this.updatedRoadwayWidth = this.recordToBeEdited.roadwayWidth
		this.updatedMaxVehicles = this.recordToBeEdited.maxVehicles
	}

	addRecord() {
		if (this.newJunctionName != "" && this.newDistrict != "" && this.newRoadwayWidth != 0 && (this.newMaxVehicles != null && this.newMaxVehicles != 0)) {
			if (this.newJunctionName.length < 255 && this.newDistrict.length < 255) {
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

				let newRoadwayWidthMaxVehiclesMap: RoadwayWidthMaxPcuMap = {
					roadwayWidth: this.newRoadwayWidth,
					maxPcu: this.newMaxVehicles
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
										this._snackBar.open('Added Record Successfully', '\u2716', {
											duration: 3000
										})
									},
									error: (error: HttpErrorResponse) => {
										alert(error.message)
									}
								})
							},
							error: (error: HttpErrorResponse) => {
								alert(error.message)
							}
						})
					},
					error: (error: HttpErrorResponse) => {
						alert(error.message)
					}
				})
			} else {
				this._snackBar.open('Note: Information too long', '\u2716', {
					duration: 3000
				})
			}

		} else {
			this._snackBar.open('Note: All Fields are required', '\u2716', {
				duration: 3000
			})
		}
	}


	update() {

		if (this.updatedDistrict != "" && (this.updatedRoadwayWidth != null && this.updatedRoadwayWidth != 0) && (this.updatedMaxVehicles != null && this.updatedMaxVehicles != 0)) {

			let updatedJunctionDistrictMap: JunctionDistrictMap = {
				junctionName: this.recordToBeEdited.junctionName,
				district: this.updatedDistrict
			}

			let updatedJunctionRoadwayWidthMap: JunctionRoadwayWidthMap = {
				junctionName: this.recordToBeEdited.junctionName,
				roadwayWidth: this.updatedRoadwayWidth
			}

			let updatedRoadwayWidthMaxVehiclesMap: RoadwayWidthMaxPcuMap = {
				roadwayWidth: this.updatedRoadwayWidth,
				maxPcu: this.updatedMaxVehicles
			}

			this.junctionSpecificsService.updateJunctionDistrictMap(updatedJunctionDistrictMap).subscribe({
				next: (response) => {
					this.junctionSpecificsService.updateJunctionRoadwayWidthMap(updatedJunctionRoadwayWidthMap).subscribe({
						next: (response) => {
							this.junctionSpecificsService.updateRoadwayWidthMaxVehiclesMap(updatedRoadwayWidthMaxVehiclesMap).subscribe({
								next: (response) => {
									this.getAllJunctionSpecificDataFromDB()
									this._snackBar.open('Updated Fields Successfully', '\u2716', {
										duration: 3000
									})
								},
								error: (error: HttpErrorResponse) => {
									alert(error.message)
								}
							})
						},
						error: (error: HttpErrorResponse) => {
							alert(error.message)
						}
					})
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
				}
			})

		} else {
			this._snackBar.open('Note: All Fields are required', '\u2716', {
				duration: 3000
			})
		}
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
									this._snackBar.open('Note: Deleted Record SuccessFully', '\u2716', {
										duration: 3000
									})
									resolve('deletedFromDB')
								},
								error: (error: HttpErrorResponse) => {
									alert(error.message)
								}
							})
						},
						error: (error: HttpErrorResponse) => {
							alert(error.message)
						}
					})
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
				}
			})
		})
		return deletePromise
	}


	fileChangeListener($event: any) {
		const files = $event.srcElement.files;
		let fileName = files[0]['name']
		let header: boolean = true
		header = (header as unknown as string) === 'true' || header === true;

		const arr = fileName.split('.')
		if (arr[arr.length - 1] === 'csv') {
			this.ngxCsvParser.parse(files[0], { header: header, delimiter: ',', encoding: 'utf8' })
			.pipe().subscribe({
				next: (result) => {
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
				}
			})
		} else {
			this._snackBar.open("Note: Incorrect file type (Please choose a .csv file", '\u2716', {
				duration: 3000
			})
		}
	}

	delete(record: any) {
		this.deleteFromDB(record).then(() => {
			this.getAllJunctionSpecificDataFromDB()
		})
	}

}
