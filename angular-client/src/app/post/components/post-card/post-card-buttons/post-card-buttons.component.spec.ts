import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardButtonsComponent } from './post-card-buttons.component';

describe('PostCardButtonsComponent', () => {
  let component: PostCardButtonsComponent;
  let fixture: ComponentFixture<PostCardButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCardButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
