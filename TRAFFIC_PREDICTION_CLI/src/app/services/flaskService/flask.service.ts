import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PropService } from '../propService/prop.service';

@Injectable({
	providedIn: 'root'
})
export class FlaskService {
	constructor(private http: HttpClient, private propService: PropService) { }

	public getTableData() {
		return this.http.get('process/readData')
	}

	public getPlot() {
		return this.http.get('process/getPlot')
	}

	public predict() {
		return this.http.get('process/getPredicted')
	}

	public setData() {
		return this.http.get('process/setData')
	}

	public sendCsvData(csvData: object) {
		return this.http.post('process/setCsvData', csvData)
	}

	public getResultTable() {
		return this.http.get('process/getResultTable')
	}

	public getAccuracy() {
		return this.http.get('process/getAccuracy')
	}

	public getActualPredicted() {
		return this.http.get('process/getActualPredicted')
	}

	public getActualPredictedForPlot() {
		return this.http.get('process/getActualPredictedForPlot')
	}

	public sendInput(input: object) {
		return this.http.post('process/input', input)
	}

	public getModelSummary() {
		return this.http.get('process/getModelSummary')
	}
	
	public getAccuracies() {
		return this.http.get('process/getAccuracies')
	}

	public getAllJunctions() {
		return this.http.get('process/getAllJunctions')
	}

	public sendTrainingSpecifics(trainingSpecifics: Object) {
		return this.http.post('process/sendTrainingSpecifics', trainingSpecifics)
	}

}
