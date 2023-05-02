import { TestBed } from '@angular/core/testing';

import { CsvInstanceService } from './csv-instance.service';

describe('CsvInstanceService', () => {
	let service: CsvInstanceService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CsvInstanceService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
