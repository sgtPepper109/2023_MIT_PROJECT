import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlaskService } from 'src/app/services/flaskService/flask.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-add-to-master-dialog',
	templateUrl: './add-to-master-dialog.component.html',
	styleUrls: ['./add-to-master-dialog.component.css']
})
export class AddToMasterDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<AddToMasterDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private flaskService: FlaskService,
		private _snackBar: MatSnackBar,
	) {}

	junction: string = this.data.junction
	algorithmToAddToMaster: string = this.data.algorithmToAddToMaster
	testRatioToAddToMaster: string = this.data.testRatioToAddToMaster
	accuracy: string = this.data.accuracy
	startYear: number = this.data.startYear

	addToMaster() {

		if (this.algorithmToAddToMaster != "" && this.testRatioToAddToMaster != "" && this.startYear != 0
			// && this.relativeChange != ""
		) {
			let testRatioToAddToMaster = parseFloat(this.testRatioToAddToMaster)
			this.flaskService.addToMaster(
				this.junction,
				this.algorithmToAddToMaster,
				testRatioToAddToMaster,
				this.startYear
			).subscribe({
				next: (response) => {
					this._snackBar.open('Added to master', '\u2716', {
						duration: 3000
					})
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
				}
			})
		} else {
			this._snackBar.open('Note: provide details', '\u2716', {
				duration: 3000
			})
		}

	}

}
