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
	public inputJunction: string = ""
	public inputTime: string = ""
	public time: string = ""
	public maxVehicles: number = 0
	public autoTrained: boolean = true
	public predictionPlotData: any
	public junctions: any
	public datetime: any
	public vehicles: any


	constructor() {
		// TODO Constructor
	}
}
