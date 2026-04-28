import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatusActionButtonComponent } from './status-action-button.component';

describe('StatusActionButtonComponent', () => {
  let component: StatusActionButtonComponent;
  let fixture: ComponentFixture<StatusActionButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StatusActionButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
