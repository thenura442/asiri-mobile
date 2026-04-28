import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestCategoryFilterComponent } from './test-category-filter.component';

describe('TestCategoryFilterComponent', () => {
  let component: TestCategoryFilterComponent;
  let fixture: ComponentFixture<TestCategoryFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestCategoryFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestCategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
