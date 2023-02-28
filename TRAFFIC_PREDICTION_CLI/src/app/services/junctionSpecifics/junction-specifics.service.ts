import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropService } from '../propService/prop.service';
import { JunctionDistrictMap } from '../junctionDistrictMap/junction-district-map';
import { JunctionMaxVehiclesMap } from '../junctionMaxVehiclesMap/junction-max-vehicles-map';
import { JunctionRoadwayWidthMap } from '../junctionRoadwayWidth/junction-roadway-width-map';

@Injectable({
	providedIn: 'root'
})
export class JunctionSpecificsService {
	constructor(private http: HttpClient, private propService: PropService) { }

	private apiServerUrl = environment.apiBaseUrl

	public addJunctionDistrictMap(junctionDistricts: Array<JunctionDistrictMap>) {
		return this.http.post(`${this.apiServerUrl}/junctionDistrict/addJunctionDistrictMap`, junctionDistricts)
	}

	public addJunctionMaxVehiclesMap(junctionMaxVehicles: Array<JunctionMaxVehiclesMap>) {
		return this.http.post(`${this.apiServerUrl}/junctionMaxVehicles/addJunctionMaxVehiclesMap`, junctionMaxVehicles)
	}

	public addJunctionRoadwayWidthMap(junctionRoadwayWidthMap: Array<JunctionRoadwayWidthMap>) {
		console.log(" in", junctionRoadwayWidthMap)
		return this.http.post(`${this.apiServerUrl}/junctionRoadwayWidth/addJunctionRoadwayWidthMap`, junctionRoadwayWidthMap)
	}
	
	public getJunctionMaxVehiclesMap() {
		return this.http.get(`${this.apiServerUrl}/junctionMaxVehicles/getJunctionMaxVehiclesMap`)
	}

	public getAllDistricts() {
		return this.http.get(`${this.apiServerUrl}/districts/getAllDistricts`)
	}
}
