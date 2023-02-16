import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PropService {
	public data: object = {};
	public obj: object = {};
	public trainRatio: number = 0
	public testRatio: number = 0
	public dataset: string = ""
	constructor() { }
}
