import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropService } from '../../propService/prop.service';
import { JunctionDistrictMap, RoadwayWidthMaxVehiclesMap, JunctionRoadwayWidthMap } from '../../../interfaces/all-interfaces';

@Injectable({
	providedIn: 'root'
})
export class JunctionSpecificsService {
	constructor(private http: HttpClient, private propService: PropService) { }

	public getAllJunctions() {
		return this.http.get('junctionSpecifics/getAllJunctions')
	}

	public addRoadwayWidthMaxVehiclesMap(roadwayWidthMaxVehiclesMaps: Array<RoadwayWidthMaxVehiclesMap>) {
		return this.http.post('junctionSpecifics/roadwayWidthMaxVehicles/addRoadwayWidthMaxVehiclesMaps', roadwayWidthMaxVehiclesMaps)
	}

	public addJunctionDistrictMap(junctionDistricts: Array<JunctionDistrictMap>) {
		return this.http.post('junctionSpecifics/junctionDistrict/addJunctionDistrictMap', junctionDistricts)
	}

	public addJunctionRoadwayWidthMap(junctionRoadwayWidthMap: Array<JunctionRoadwayWidthMap>) {
		return this.http.post('junctionSpecifics/junctionRoadwayWidth/addJunctionRoadwayWidthMap', junctionRoadwayWidthMap)
	}
	
	public getAllDistricts() {
		return this.http.get('junctionSpecifics/districts/getAllDistricts')
	}

	public getAllRoadwayWidths() {
		return this.http.get('junctionSpecifics/roadwayWidths/getAllRoadwayWidths')
	}

	public getAllJunctionDistrictMaps() {
		return this.http.get('junctionSpecifics/junctionDistrict/getAllJunctionDistrictMaps')
	}

	public getAllJunctionRoadwayWidthMaps() {
		return this.http.get('junctionSpecifics/junctionRoadwayWidth/getAllJunctionRoadwayWidthMaps')
	}

	public getAllRoadwayWidthMaxVehiclesMaps() {
		return this.http.get('junctionSpecifics/roadwayWidthMaxVehicles/getAllRoadwayWidthMaxVehiclesMaps')
	}

	public updateJunctionDistrictMap(junctionDistrictMap: JunctionDistrictMap) {
		return this.http.post('junctionSpecifics/junctionDistrict/updateJunctionDistrictMap?junction=' + junctionDistrictMap.junctionName, junctionDistrictMap)
	}

	public updateJunctionRoadwayWidthMap(junctionRoadwayWidthMap: JunctionRoadwayWidthMap) {
		return this.http.post('junctionSpecifics/junctionRoadwayWidth/updateJunctionRoadwayWidthMap?junction=' + junctionRoadwayWidthMap.junctionName, junctionRoadwayWidthMap)
	}

	public updateRoadwayWidthMaxVehiclesMap(roadwayWidthMaxVehiclesMap: RoadwayWidthMaxVehiclesMap) {
		return this.http.post('junctionSpecifics/roadwayWidthMaxVehicles/updateRoadwayWidthMaxVehiclesMap?roadwayWidth=' + roadwayWidthMaxVehiclesMap.roadwayWidth, roadwayWidthMaxVehiclesMap)
	}

	public addSingleRoadwayWidthMaxVehiclesMap(roadwayWidthMaxVehiclesMaps: RoadwayWidthMaxVehiclesMap) {
		return this.http.post('junctionSpecifics/roadwayWidthMaxVehicles/addSingleRoadwayWidthMaxVehiclesMaps', roadwayWidthMaxVehiclesMaps)
	}

	public addSingleJunctionDistrictMap(junctionDistricts: JunctionDistrictMap) {
		return this.http.post('junctionSpecifics/junctionDistrict/addSingleJunctionDistrictMap', junctionDistricts)
	}

	public addSingleJunctionRoadwayWidthMap(junctionRoadwayWidthMap: JunctionRoadwayWidthMap) {
		return this.http.post('junctionSpecifics/junctionRoadwayWidth/addSingleJunctionRoadwayWidthMap', junctionRoadwayWidthMap)
	}

	public deleteJunctionDistrictMap(whichJunction: string) {
		return this.http.get('junctionSpecifics/junctionDistrict/deleteJunctionDistrictMap?junction=' + whichJunction)
	}

	public deleteJunctionRoadwayWidthMap(whichJunction: string) {
		return this.http.get('junctionSpecifics/junctionRoadwayWidth/deleteJunctionRoadwayWidthMap?junction=' + whichJunction)
	}

	public deleteRoadwayWidthMaxVehiclesMap(whichRoadwayWidth: string) {
		return this.http.get('junctionSpecifics/roadwayWidthMaxVehicles/deleteRoadwayWidthMaxVehiclesMap?roadwayWidth=' + whichRoadwayWidth)
	}

}
