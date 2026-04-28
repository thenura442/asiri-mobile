import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BookingStepperComponent } from './booking-stepper.component';

describe('BookingStepperComponent', () => {
  let component: BookingStepperComponent;
  let fixture: ComponentFixture<BookingStepperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BookingStepperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
