import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackingMapComponent } from './tracking-map.component';

describe('TrackingMapComponent', () => {
  let component: TrackingMapComponent;
  let fixture: ComponentFixture<TrackingMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TrackingMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
