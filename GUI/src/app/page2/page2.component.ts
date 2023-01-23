import { Component, OnInit } from '@angular/core';
import { PropService } from '../prop.service';
import { OperationService } from '../operation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
	selector: 'app-page2',
	templateUrl: './page2.component.html',
	styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnInit {
	constructor(
		private propService: PropService, 
		private operationService: OperationService
	) {
		// console.log(this.propService.data)
	}

	imageSrc: any

	ngOnInit() {}

	plotReady = false
	fetchPlot() {
		this.operationService.getPlot().subscribe(
			(response) => {
				this.imageSrc = Object.values(response)[0]
				this.plotReady = true
			},
			(error: HttpErrorResponse) => {
				console.log(error.message)
				alert(error.message)
				
			}
		)
	}

	displayedColumns: string[] = ['DateTime', 'Junction', 'Vehicles', 'ID', 'Year', 'Month', 'Day', 'Hour'];
	dataSource = Object.values(this.propService.data)
}