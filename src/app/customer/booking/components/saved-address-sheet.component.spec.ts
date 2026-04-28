import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SavedAddressSheetComponent } from './saved-address-sheet.component';

describe('SavedAddressSheetComponent', () => {
  let component: SavedAddressSheetComponent;
  let fixture: ComponentFixture<SavedAddressSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SavedAddressSheetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SavedAddressSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
