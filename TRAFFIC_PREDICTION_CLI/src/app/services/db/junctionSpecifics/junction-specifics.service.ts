import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropService } from '../../propService/prop.service';
import { JunctionDistrictMap, RoadwayWidthMaxPcuMap, JunctionRoadwayWidthMap } from '../../../interfaces/all-interfaces';

@Injectable({
	providedIn: 'root'
})
export class JunctionSpecificsService {
	constructor(private http: HttpClient, private propService: PropService) { }

	public getAllJunctions() {
		return this.http.get('junctionSpecifics/getAllJunctions')
	}

	public getAllDistricts() {
		return this.http.get('junctionSpecifics/districts/getAllDistricts')
	}

	public getAllJunctionDistrictMaps() {
		return this.http.get('junctionSpecifics/junctionDistrict/getAllJunctionDistrictMaps')
	}

	public getAllJunctionRoadwayWidthMaps() {
		return this.http.get('junctionSpecifics/roadwayWidths/getAllJunctionRoadwayWidthMaps')
	}

	public getAllRoadwayWidthMaxVehiclesMaps() {
		return this.http.get('junctionSpecifics/pcu/getAllPcu')
	}

	public updateJunctionDistrictMap(junctionDistrictMap: JunctionDistrictMap) {
		return this.http.post('junctionSpecifics/junctionDistrict/updateJunctionDistrictMap?junction=' + junctionDistrictMap.junctionName, junctionDistrictMap)
	}

	public updateJunctionRoadwayWidthMap(junctionRoadwayWidthMap: JunctionRoadwayWidthMap) {
		return this.http.post('junctionSpecifics/roadwayWidths/updateJunctionRoadwayWidthMap?junction=' + junctionRoadwayWidthMap.junctionName, junctionRoadwayWidthMap)
	}

	public updateRoadwayWidthMaxVehiclesMap(roadwayWidthMaxVehiclesMap: RoadwayWidthMaxPcuMap) {
		return this.http.post('junctionSpecifics/pcu/updatePcu?roadwayWidth=' + roadwayWidthMaxVehiclesMap.roadwayWidth, roadwayWidthMaxVehiclesMap)
	}

	public addSingleRoadwayWidthMaxVehiclesMap(roadwayWidthMaxVehiclesMaps: RoadwayWidthMaxPcuMap) {
		return this.http.post('junctionSpecifics/pcu/addSinglePcu', roadwayWidthMaxVehiclesMaps)
	}

	public addSingleJunctionDistrictMap(junctionDistricts: JunctionDistrictMap) {
		return this.http.post('junctionSpecifics/junctionDistrict/addSingleJunctionDistrictMap', junctionDistricts)
	}

	public addSingleJunctionRoadwayWidthMap(junctionRoadwayWidthMap: JunctionRoadwayWidthMap) {
		return this.http.post('junctionSpecifics/roadwayWidths/addSingleJunctionRoadwayWidthMap', junctionRoadwayWidthMap)
	}

	public deleteJunctionDistrictMap(whichJunction: string) {
		return this.http.get('junctionSpecifics/junctionDistrict/deleteJunctionDistrictMap?junction=' + whichJunction)
	}

	public deleteJunctionRoadwayWidthMap(whichJunction: string) {
		return this.http.get('junctionSpecifics/roadwayWidths/deleteJunctionRoadwayWidthMap?junction=' + whichJunction)
	}

	public deleteRoadwayWidthMaxVehiclesMap(whichRoadwayWidth: string) {
		return this.http.get('junctionSpecifics/pcu/deletePcu?roadwayWidth=' + whichRoadwayWidth)
	}

}
