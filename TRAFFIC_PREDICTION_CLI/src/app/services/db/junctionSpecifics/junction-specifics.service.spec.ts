import { TestBed } from '@angular/core/testing';

import { JunctionSpecificsService } from './junction-specifics.service';

describe('JunctionSpecificsService', () => {
	let service: JunctionSpecificsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(JunctionSpecificsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
