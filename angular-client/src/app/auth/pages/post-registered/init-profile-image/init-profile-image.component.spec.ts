import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitProfileImageComponent } from './init-profile-image.component';

describe('InitProfileImageComponent', () => {
  let component: InitProfileImageComponent;
  let fixture: ComponentFixture<InitProfileImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitProfileImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitProfileImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
