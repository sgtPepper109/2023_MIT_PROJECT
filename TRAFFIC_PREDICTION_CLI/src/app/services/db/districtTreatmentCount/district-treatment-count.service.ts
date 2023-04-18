import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class DistrictTreatmentCountService {
	constructor(private http: HttpClient) { }

	public increaseDistrictTreatmentCount(districtName: string, startYear: number, durationYears: number) {
		return this.http.get('districtTreatmentCount/increaseDistrictTreatmentCount?districtName=' + districtName + "&startYear=" + startYear + "&durationYears=" + durationYears)
	}

	public getAllDistrictTreatmentCounts() {
		return this.http.get('districtTreatmentCount/getAllDistrictTreatmentCounts')
	}

	public clearDistrictTreatmentCounts() {
		return this.http.get('districtTreatmentCount/clearAllDistrictTreatmentCounts')
	}

	public decreaseDistrictTreatmentCount(district: string, startYear: number, durationYears: number) {
		return this.http.get('districtTreatmentCount/decreaseDistrictTreatmentCount?districtName=' + district
			+ '&startYear=' + startYear
			+ '&durationYears=' + durationYears
		)
	}
	
}
