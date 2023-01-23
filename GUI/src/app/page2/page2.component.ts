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
		console.log(this.propService.data)
		this.operationService.getPlot().subscribe(
			(response) => {
				this.junction1plot = Object.values(response)[0]
				this.junction2plot = Object.values(response)[1]
				this.junction3plot = Object.values(response)[2]
				this.junction4plot = Object.values(response)[3]
				console.log(this.junction1plot, this.junction2plot, this.junction3plot, this.junction4plot)
			},
			(error: HttpErrorResponse) => {
				console.log(error.message)
				alert(error.message)
				
			}
		)
	}

	inputJunction = "Choose Junction"
	inputMonths = ""
	obj = {}

	junction1plot: any
	junction2plot: any
	junction3plot: any
	junction4plot: any

	plotReadyFor1 = false
	plotReadyFor2 = false
	plotReadyFor3 = false
	plotReadyFor4 = false
	str = ""

	predictionImageReady = false

	ngOnInit() {}

	show1() {
		this.str = "1"
		this.plotReadyFor1 = true
		this.plotReadyFor2 = false
		this.plotReadyFor3 = false
		this.plotReadyFor4 = false
	}
	show2() {
		this.str = "2"
		this.plotReadyFor1 = false
		this.plotReadyFor2 = true
		this.plotReadyFor3 = false
		this.plotReadyFor4 = false
	}
	show3() {
		this.str = "3"
		this.plotReadyFor1 = false
		this.plotReadyFor2 = false
		this.plotReadyFor3 = true
		this.plotReadyFor4 = false
	}
	show4() {
		this.str = "4"
		this.plotReadyFor1 = false
		this.plotReadyFor2 = false
		this.plotReadyFor3 = false
		this.plotReadyFor4 = true
	}

	start() {
		if (this.inputJunction !== "Choose Junction" && this.inputMonths !== "") {
			this.propService.obj = {junction: this.inputJunction, months: this.inputMonths}

			this.operationService.predict(this.inputJunction + '_' + this.inputMonths).subscribe(
				(response) => {
					console.log(response)
					this.predictionImageReady = true
				},
				(error: HttpErrorResponse) => {
					console.log(error.message)
				}
			)

		} else {

		}
	}

	displayedColumns: string[] = ['DateTime', 'Junction', 'Vehicles', 'ID', 'Year', 'Month', 'Day', 'Hour'];
	dataSource = Object.values(this.propService.data)
}