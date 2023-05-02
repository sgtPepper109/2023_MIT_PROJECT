import { TestBed } from '@angular/core/testing';

import { DistrictTreatmentCountService } from './district-treatment-count.service';

describe('DistrictTreatmentCountService', () => {
	let service: DistrictTreatmentCountService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DistrictTreatmentCountService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
