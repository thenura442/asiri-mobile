import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileMenuItemComponent } from './profile-menu-item.component';

describe('ProfileMenuItemComponent', () => {
  let component: ProfileMenuItemComponent;
  let fixture: ComponentFixture<ProfileMenuItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProfileMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
