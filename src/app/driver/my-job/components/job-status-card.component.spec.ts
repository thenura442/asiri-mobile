import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobStatusCardComponent } from './job-status-card.component';

describe('JobStatusCardComponent', () => {
  let component: JobStatusCardComponent;
  let fixture: ComponentFixture<JobStatusCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [JobStatusCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JobStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
