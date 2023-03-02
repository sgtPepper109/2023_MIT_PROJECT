import { TestBed } from '@angular/core/testing';

import { FlaskAutopredictedService } from './flask.autopredicted.service';

describe('FlaskAutopredictedService', () => {
	let service: FlaskAutopredictedService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FlaskAutopredictedService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
