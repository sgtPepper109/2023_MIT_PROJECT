import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Operation } from './operation';

@Injectable({
	providedIn: 'root'
})
export class OperationService {
	private apiServerUrl = environment.apiBaseUrl

	constructor(private http: HttpClient) { }

	public getOperations(): Observable<Operation[]> {
		return this.http.get<Operation[]>(`${this.apiServerUrl}/operation/all`)
	}

	public addOperation(operation: Operation): Observable<Operation> {
		return this.http.post<Operation>(`${this.apiServerUrl}/operation/add`, operation)
	}

	public getData() {
		return this.http.get(`${this.apiServerUrl}/operation/process`)
	}

}
