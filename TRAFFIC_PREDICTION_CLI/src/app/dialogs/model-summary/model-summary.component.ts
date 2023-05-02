import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-model-summary',
	templateUrl: './model-summary.component.html',
	styleUrls: ['./model-summary.component.css']
})
export class ModelSummaryComponent {
	constructor(
		public dialogRef: MatDialogRef<ModelSummaryComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {}

	modelSummary: any = this.data.modelSummary
	modelSummaryReady: boolean = this.data.modelSummaryReady

}
