import { Component, EventEmitter, isDevMode, NgModule, Output } from '@angular/core';
import { createPool, Pool } from 'mysql'
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

let pool:Pool;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})

export class HomeComponent {
	constructor(private router: Router) {}

	// declaring all the input field variables with help of ngModel
	dataset :string = ""
	inputtrainratio :string = ""
	inputtestratio :string = ""
	inputvalratio :string = ""

	// error message to be displayed on the screen
	errorstring :string = ""

	// for displaying if validations are not correct
	toggleErrorString = false;

	// public addOperation(): Observable<> {
	// 	return this.http.post
	// }

	// on clicking button 'process data'
	manageInfo() {

		if (this.dataset !== "" && this.inputtestratio !== "" && this.inputtrainratio !== "" && this.inputvalratio !== "") {
			var trainratio = parseFloat(this.inputtrainratio)
			var testratio = parseFloat(this.inputtestratio)
			var valratio = parseFloat(this.inputvalratio)
			
			if (trainratio + testratio + valratio === 1.0) {
				console.log(this.dataset, ' ', this.inputtrainratio, this.inputtestratio, this.inputvalratio)	
				
				// navigate to page2
				
				this.router.navigate(['/page2'])
			} else {
				this.errorstring = "Note: The ratios don't add up to 1"
				this.toggleErrorString = true
			}
		} else {
			this.errorstring = "Note: All fields are required"
			this.toggleErrorString = true
		}
	}
}
