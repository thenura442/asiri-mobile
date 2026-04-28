import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancelBookingSheetComponent } from './cancel-booking-sheet.component';

describe('CancelBookingSheetComponent', () => {
  let component: CancelBookingSheetComponent;
  let fixture: ComponentFixture<CancelBookingSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CancelBookingSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelBookingSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
