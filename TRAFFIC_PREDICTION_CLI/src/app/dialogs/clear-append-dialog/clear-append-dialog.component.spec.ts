import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearAppendDialogComponent } from './clear-append-dialog.component';

describe('ClearAppendDialogComponent', () => {
	let component: ClearAppendDialogComponent;
	let fixture: ComponentFixture<ClearAppendDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ClearAppendDialogComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ClearAppendDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
