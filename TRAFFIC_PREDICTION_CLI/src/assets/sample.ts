import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class SampleCsvData {
    sampleCsvDataHourly: Array<Object> = [
        {
            DateTime: "2014-11-01 00:00:00",
            PCU: 15,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            PCU: 13,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-02 00:00:00",
            PCU: 20,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-01 00:00:00",
            PCU: 6,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            PCU: 5,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-02 00:00:00",
            PCU: 9,
            Junction: "Paud Road"
        },
        {
            DateTime: "2017-01-01 00:00:00",
            PCU: 3,
            Junction: "Pune Station Road"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            PCU: 1,
            Junction: "Pune Station Road"
        },
        {
            DateTime: "2014-11-01 00:00:00",
            PCU: 9,
            Junction: "Swargate Bus Stand"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            PCU: 7,
            Junction: "Swargate Bus Stand"
        }
    ]

    sampleCsvDataDaily: Array<Object> = [
        {
            DateTime: "2014-11-01",
            PCU: 15,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-02",
            PCU: 13,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-03",
            PCU: 20,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-01",
            PCU: 6,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-02",
            PCU: 5,
            Junction: "Paud Road"
        },
        {
            DateTime: "2017-01-01",
            PCU: 3,
            Junction: "Pune Station Road"
        },
        {
            DateTime: "2014-11-02",
            PCU: 1,
            Junction: "Pune Station Road"
        },
        {
            DateTime: "2014-11-03",
            PCU: 2,
            Junction: "Pune Station Road"
        },
        {
            DateTime: "2014-11-01",
            PCU: 9,
            Junction: "Swargate Bus Stand"
        },
        {
            DateTime: "2014-11-02",
            PCU: 7,
            Junction: "Swargate Bus Stand"
        }
    ]

	constructor() {
		// TODO Constructor
	}
}
