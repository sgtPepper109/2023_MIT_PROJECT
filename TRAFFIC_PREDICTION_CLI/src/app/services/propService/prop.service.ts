import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PropService {
	public data: object = {};
	public obj: object = {};
	public testRatio: number = 0
	constructor() { }
}
