import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmptyJobStateComponent } from './empty-job-state.component';

describe('EmptyJobStateComponent', () => {
  let component: EmptyJobStateComponent;
  let fixture: ComponentFixture<EmptyJobStateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EmptyJobStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyJobStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
