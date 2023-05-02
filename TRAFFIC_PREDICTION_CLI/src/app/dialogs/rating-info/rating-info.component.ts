import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-rating-info',
	templateUrl: './rating-info.component.html',
	styleUrls: ['./rating-info.component.css']
})
export class RatingInfoComponent {
	constructor(
		public dialogRef: MatDialogRef<RatingInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {}

	starsTableMeaning: Array<Array<string>> = [
		// no congestion
		// no treatment needed
		["No congestion", "No Treatment Needed"],
		// congestion level: low (acceptable/tolerable)
		// treatment not recommended
		["Congestion level: Low (acceptable/tolerable)", "Treatment Not Recommended"],
		// congestion level: medium (acceptable/tolerable)
		// attention level for treatment: important
		["Congestion level: Medium (acceptable/tolerable)", "Attention level for treatment: Important"],
		// congestion level: increased (hardly acceptable/tolerable)
		// attention level for treatment: fairly important
		["Congestion level: Increased (hardly acceptable/tolerable)", "Attention level for treatment: Fairly Important"],
		// congestion level: high (unacceptable/intolerable)
		// attention level for treatment: highly important
		["Congestion level: High (unacceptable/intolerable)", "Attention level for treatment: Highly Important"],
		// congestion level: very high (unnacceptable/intolerable)
		// attention level for treatment: extremely important
		["Congestion level: Very High (unnacceptable/intolerable)", "Attention level for treatment: Extremely Important"],
		// congestion level: extreme (unacceptable/intolerable)
		// attention level for treatment: no opinion
		["Congestion level: Extreme (unacceptable/intolerable)", "Attention level for treatment: No Opinion"]

	]
	starsTableDesc: Array<Array<string>> = [
		["star", "star_border", "star_border", "star_border", "star_border"],
		["star", "star", "star_border", "star_border", "star_border"],
		["star", "star", "star", "star_border", "star_border"],
		["star", "star", "star", "star_half", "star_border"],
		["star", "star", "star", "star", "star_border"],
		["star", "star", "star", "star", "star_half"],
		["star", "star", "star", "star", "star"],
	]
	ratings: Array<number> = [1, 2, 3, 3.5, 4, 4.5, 5]
}
