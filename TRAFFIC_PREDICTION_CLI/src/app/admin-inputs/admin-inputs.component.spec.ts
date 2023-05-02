import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminInputsComponent } from './admin-inputs.component';

describe('AdminInputsComponent', () => {
	let component: AdminInputsComponent;
	let fixture: ComponentFixture<AdminInputsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AdminInputsComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(AdminInputsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
