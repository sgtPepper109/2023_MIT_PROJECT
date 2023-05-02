import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-clear-append-dialog',
	templateUrl: './clear-append-dialog.component.html',
	styleUrls: ['./clear-append-dialog.component.css']
})
export class ClearAppendDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<ClearAppendDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {}

	action: string = this.data.action
	junction: string = this.data.junction
	alreadyTrained: string = this.data.alreadyTrained
	performAppendOrClearAction() {
		this.data = {
			action: this.data.action,
			junction: this.data.junction,
			finalizedAction: true
		}
		this.dialogRef.close(this.data);
	}
	doNotPerformAction() {
		this.data = {
			action: this.data.action,
			junction: this.data.junction,
			finalizedAction: false
		}
		this.dialogRef.close(this.data);
	}
}
