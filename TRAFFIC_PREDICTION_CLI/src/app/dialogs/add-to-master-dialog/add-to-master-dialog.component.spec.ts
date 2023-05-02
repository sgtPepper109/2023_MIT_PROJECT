import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToMasterDialogComponent } from './add-to-master-dialog.component';

describe('AddToMasterDialogComponent', () => {
  let component: AddToMasterDialogComponent;
  let fixture: ComponentFixture<AddToMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToMasterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
