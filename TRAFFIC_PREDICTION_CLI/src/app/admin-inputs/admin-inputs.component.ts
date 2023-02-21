import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flaskService/flask.service';
import { JunctionSpecificsService } from '../services/junctionSpecifics/junction-specifics.service';

@Component({
	selector: 'app-admin-inputs',
	templateUrl: './admin-inputs.component.html',
	styleUrls: ['./admin-inputs.component.css']
})
export class AdminInputsComponent implements OnInit {
	constructor(
		public flaskService: FlaskService,
		public junctionSpecificsService: JunctionSpecificsService
	) {}

	district: string = ""
	junctions: Array<number> = []
	junctionDistrictObj: object = {}
	junctionDistrictMap: Array<object> = []

	ngOnInit(): void {

		this.flaskService.getAllJunctions().subscribe({
			next: (response) => {
				this.junctions = Object.values(response)
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})
	}


	assignDistrict(junction: number, district: string) {
		this.junctionDistrictObj = {
			junctionName: junction,
			district: district
		}
		this.junctionDistrictMap.push(this.junctionDistrictObj)
	}

	submit() {
		this.junctionSpecificsService.storeJunctionDistrictMap(this.junctionDistrictMap).subscribe({
			next: (response) => {
				console.log(response)
			},
			error: (error: HttpErrorResponse) => {
				console.log(error)
				alert(error.message)
			}
		})
	}
	
	
}
