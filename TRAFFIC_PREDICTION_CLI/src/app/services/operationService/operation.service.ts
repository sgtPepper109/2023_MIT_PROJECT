import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Operation } from './operation';
import { PropService } from '../propService/prop.service';

@Injectable({
	providedIn: 'root'
})
export class OperationService {

	constructor(private http: HttpClient, private propService: PropService) {}

	public getOperations(): Observable<Operation[]> {
		return this.http.get<Operation[]>('operation/all')
	}

	public addOperation(operation: Operation): Observable<Operation> {
		return this.http.post<Operation>('operation/add', operation)
	}

}
