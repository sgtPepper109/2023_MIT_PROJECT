import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropService } from '../propService/prop.service';

@Injectable({
	providedIn: 'root'
})
export class FlaskService {
	constructor(private http: HttpClient, private propService: PropService) { }

	private apiServerUrl = environment.apiBaseUrl

	public getTableData() {
		return this.http.get(`${this.apiServerUrl}/process/readData`)
	}

	public getPlot() {
		return this.http.get(`${this.apiServerUrl}/process/getPlot`)
	}

	public predict() {
		return this.http.get(`${this.apiServerUrl}/process/getPredicted`)
	}

	public setData() {
		return this.http.get(`${this.apiServerUrl}/process/setData`)
	}

	public sendCsvData(csvData: object) {
		return this.http.post(`${this.apiServerUrl}/process/setCsvData`, csvData)
	}

	public getResultTable() {
		return this.http.get(`${this.apiServerUrl}/process/getResultTable`)
	}

	public getAccuracy() {
		return this.http.get(`${this.apiServerUrl}/process/getAccuracy`)
	}

	public getActualPredicted() {
		return this.http.get(`${this.apiServerUrl}/process/getActualPredicted`)
	}

	public getActualPredictedForPlot() {
		return this.http.get(`${this.apiServerUrl}/process/getActualPredictedForPlot`)
	}

	public sendInput(input: object) {
		return this.http.post(`${this.apiServerUrl}/process/input`, input)
	}

	public getModelSummary() {
		return this.http.get(`${this.apiServerUrl}/process/getModelSummary`)
	}
	
	public getAccuracies() {
		return this.http.get(`${this.apiServerUrl}/process/getAccuracies`)
	}

	public getAllJunctions() {
		return this.http.get(`${this.apiServerUrl}/process/getAllJunctions`)
	}
}
