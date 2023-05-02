import { Component, Inject } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { SampleCsvData } from 'src/assets/sample';
import { HourlySampleData } from 'src/assets/hourly_sample';
import { DailySampleData } from 'src/assets/daily_sample';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-dataset-description',
	templateUrl: './dataset-description.component.html',
	styleUrls: ['./dataset-description.component.css']
})
export class DatasetDescriptionComponent {
	constructor(
		public dialogRef: MatDialogRef<DatasetDescriptionComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sampleCsv: SampleCsvData,
		private hourlyData: HourlySampleData,
		private dailyData: DailySampleData,
	) {}

	sampleCsvTableDaily: Array<any> = this.sampleCsv.sampleCsvDataDaily
	sampleCsvTableHourly: Array<any> = this.sampleCsv.sampleCsvDataHourly

	onNoClick(): void {
		this.dialogRef.close();
	}
	
	downloadSample(sampleType: string) {
		const options = {
			fieldSeparator: ',',
			quoteStrings: '',
			decimalseparator: '.',
			showLabels: true,
			useBom: true,
			noDownload: false,
			headers: ['DateTime', 'Vehicles', 'Junction']
		};
		try {
			if (sampleType == 'Hourly') {
				new ngxCsv(this.hourlyData.HourlySampleData, "sample_hourly", options);
			} else {
				new ngxCsv(this.dailyData.DailySampleData, "sample_daily", options);
			}
		} catch (error) {
			alert(error)
		}

	}
}
