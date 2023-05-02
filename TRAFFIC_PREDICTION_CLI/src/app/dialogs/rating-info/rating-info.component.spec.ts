import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingInfoComponent } from './rating-info.component';

describe('RatingInfoComponent', () => {
  let component: RatingInfoComponent;
  let fixture: ComponentFixture<RatingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
