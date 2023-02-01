import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PropService } from '../propService/prop.service';

@Injectable({
	providedIn: 'root'
})
export class FlaskService {
	private apiServerUrl = environment.apiBaseUrl

	constructor(private http: HttpClient, private propService: PropService) { }

	public getTableData() {
		return this.http.get(`${this.apiServerUrl}/process/readData`)
	}

	public getPlot() {
		return this.http.get(`${this.apiServerUrl}/process/getPlot`)
	}

	public predict(obj: string) {
		return this.http.get(`${this.apiServerUrl}/process/getPredicted/${obj}`)
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
}
