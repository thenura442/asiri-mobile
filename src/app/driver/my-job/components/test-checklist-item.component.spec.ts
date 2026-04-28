import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestChecklistItemComponent } from './test-checklist-item.component';

describe('TestChecklistItemComponent', () => {
  let component: TestChecklistItemComponent;
  let fixture: ComponentFixture<TestChecklistItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestChecklistItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
