import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SampleCsvData {
    sampleCsvDataHourly: Array<Object> = [
        {
            DateTime: "2014-11-01 00:00:00",
            Pcu: 15,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-01 01:00:00",
            Pcu: 13,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-02 00:00:00",
            Pcu: 20,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-02 01:00:00",
            Pcu: 6,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-03 00:00:00",
            Pcu: 5,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-03 01:00:00",
            Pcu: 9,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-01-04 00:00:00",
            Pcu: 3,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-04 01:00:00",
            Pcu: 1,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-05 00:00:00",
            Pcu: 9,
            Junction: "Paud Road"
        },
        {
            DateTime: "2014-11-05 01:00:00",
            Pcu: 7,
            Junction: "Paud Road"
        }
    ]

    sampleCsvDataDaily: Array<Object> = [
        {
            DateTime: "2014-11-01",
            Pcu: 15,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-02",
            Pcu: 13,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-03",
            Pcu: 20,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-04",
            Pcu: 6,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-05",
            Pcu: 5,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-01-06",
            Pcu: 3,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-07",
            Pcu: 1,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-08",
            Pcu: 2,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-09",
            Pcu: 9,
            Junction: "Vidya Nagar"
        },
        {
            DateTime: "2014-11-10",
            Pcu: 7,
            Junction: "Vidya Nagar"
        }
    ]

    constructor() {
        // TODO Constructor
    }
}
