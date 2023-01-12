import { Component } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
	submit():void  {
		const trainRatio = parseInt((<HTMLInputElement>document.getElementById('traininginput')).value)
		const testRatio = parseInt((<HTMLInputElement>document.getElementById('testinginput')).value)
		const valRatio = parseInt((<HTMLInputElement>document.getElementById('valinput')).value)
		console.log(trainRatio, testRatio, valRatio)
	}
}
