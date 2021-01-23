import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardHeaderComponent } from './post-card-header.component';

describe('PostCardHeaderComponent', () => {
  let component: PostCardHeaderComponent;
  let fixture: ComponentFixture<PostCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCardHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
