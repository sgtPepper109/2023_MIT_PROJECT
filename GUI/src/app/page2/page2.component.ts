import { Component, OnInit, PipeTransform } from '@angular/core';
import { PropService } from '../prop.service';

import { Operation } from '../operation';
import { OperationService } from '../operation.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { response } from 'express';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
	selector: 'app-page2',
	templateUrl: './page2.component.html',
	styleUrls: ['./page2.component.css']
})
export class Page2Component implements OnInit {
	constructor(private propService: PropService, private operationService: OperationService) {
		console.log(this.propService.data)
	}

	ngOnInit() {}

	displayedColumns: string[] = ['DateTime', 'Junction', 'Vehicles', 'ID', 'Year', 'Month', 'Day', 'Hour'];
	dataSource = Object.values(this.propService.data)
}