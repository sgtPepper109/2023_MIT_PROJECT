import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SampleCsvData {
    sampleCsvData: Array<Object> = [
        {
            DateTime: "2014-11-01 00:00:00",
            Vehicles: 15,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            Vehicles: 13,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-01 00:00:00",
            Vehicles: 6,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            Vehicles: 5,
            Junction: "Paud Road"
        },
        {
            DateTime: "2017-01-01 00:00:00",
            Vehicles: 3,
            Junction: "Pune Station Road"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            Vehicles: 1,
            Junction: "Pune Station Road"
        },
        {
            DateTime: "2014-11-01 00:00:00",
            Vehicles: 9,
            Junction: "Swargate Bus Stand"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            Vehicles: 7,
            Junction: "Swargate Bus Stand"
        }
    ]

	constructor() {
		// TODO Constructor
	}
}
