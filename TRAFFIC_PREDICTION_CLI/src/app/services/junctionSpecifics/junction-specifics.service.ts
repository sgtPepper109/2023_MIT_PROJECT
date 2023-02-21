import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropService } from '../propService/prop.service';

@Injectable({
	providedIn: 'root'
})
export class JunctionSpecificsService {
	constructor(private http: HttpClient, private propService: PropService) { }

	private apiServerUrl = environment.apiBaseUrl

	public storeJunctionDistrictMap(junctionDistrictMap: object) {
		return this.http.post(`${this.apiServerUrl}/junction-specifics/storeDistricts`, junctionDistrictMap)
	}
}
