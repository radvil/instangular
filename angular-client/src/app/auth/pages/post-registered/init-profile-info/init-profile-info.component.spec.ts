import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitProfileInfoComponent } from './init-profile-info.component';

describe('InitProfileInfoComponent', () => {
  let component: InitProfileInfoComponent;
  let fixture: ComponentFixture<InitProfileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitProfileInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
