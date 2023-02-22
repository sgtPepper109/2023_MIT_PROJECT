import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropService } from '../propService/prop.service';

@Injectable({
	providedIn: 'root'
})
export class FlaskAutopredictedService {
	constructor(private http: HttpClient, private propService: PropService) { }

	private apiServerUrl = environment.apiBaseUrl

	public getAllJunctionsAccuracies() {
		return this.http.get(`${this.apiServerUrl}/process/getAllJunctionsAccuracies`)
	}

	public getAllJunctionsAccuracyScore() {
		return this.http.get(`${this.apiServerUrl}/process/getAllJunctionsAccuracyScore`)
	}

	public getPredictedTableData() {
		return this.http.get(`${this.apiServerUrl}/process/getAllJunctionsPredictedTableData`)
	}

	public getAllJunctionsPlotData() {
		return this.http.get(`${this.apiServerUrl}/process/getAllJunctionsPlotData`)
	}
}
