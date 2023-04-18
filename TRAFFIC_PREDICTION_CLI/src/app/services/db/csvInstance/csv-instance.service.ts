import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class CsvInstanceService {
	constructor(private http: HttpClient) { }


	public storeCsvData(csvData: any) {
		return this.http.post('csvInstance/addCsvInstances', csvData)
	}

}
