import { Component, isDevMode } from '@angular/core';
import { createPool, Pool } from 'mysql'

let pool:Pool;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent{
	submit(): void {
		const trainRatio = parseInt((<HTMLInputElement>document.getElementById('traininginput')).value)
		const testRatio = parseInt((<HTMLInputElement>document.getElementById('testinginput')).value)
		const valRatio = parseInt((<HTMLInputElement>document.getElementById('valinput')).value)
		
		try {
			pool = createPool({
				host: "localhost",
				user: "root",
				password: "1990",
				database: "project"
			});
			console.log('MySQL adapter pool generated Successfully');
		} catch (error) {
			console.error('[mysql.connector][init][Error]: ', error);
			throw new Error('failed to initialized pool');
		}
	}
}
