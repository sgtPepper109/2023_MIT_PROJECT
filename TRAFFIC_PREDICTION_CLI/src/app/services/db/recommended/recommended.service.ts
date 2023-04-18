import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class RecommendedService {
	constructor(private http: HttpClient) { }

	public checkIfAlreadyRecommended(junction: string, startYear: number) {
		return this.http.get('recommended/checkIfAlreadyRecommended?junction=' + junction + '&startYear=' + startYear)
	}

	public storeRecommendation(recommended: Object) {
		return this.http.post('recommended/addRecommended', recommended)
	}

	public clearAllRecommended() {
		return this.http.get('recommended/clearAllRecommended')
	}

	public deleteRecommendation(junction: string, district: string, startYear: number, durationYears: number) {
		return this.http.get('recommended/deleteRecommendation?junction=' + junction
			+ '&district=' + district 
			+ '&startYear=' + startYear 
			+ '&durationYears=' + durationYears
		)
	}

	public getDistrictInstancesWithStartYear(district: string, startYear: number) {
		return this.http.get('recommended/getDistrictInstancesWithStartYear?district=' + district + '&startYear=' + startYear)
	}
	
}
