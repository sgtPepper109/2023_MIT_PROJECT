import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropService } from '../propService/prop.service';
import { JunctionDistrictMap } from '../junctionDistrictMap/junction-district-map';
import { RoadwayWidthMaxVehiclesMap} from '../roadwayWidth-maxVehicles-map/roadwayWidth-maxVehicles-map';
import { JunctionRoadwayWidthMap } from '../junctionRoadwayWidth/junction-roadway-width-map';

@Injectable({
	providedIn: 'root'
})
export class JunctionSpecificsService {
	constructor(private http: HttpClient, private propService: PropService) { }

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

	public cleanJuntionSpecificTables() {
		return this.http.get('junctionSpecifics/cleanJunctionSpecificTables')
	}

}
