import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardFooterComponent } from './post-card-footer.component';

describe('PostCardFooterComponent', () => {
  let component: PostCardFooterComponent;
  let fixture: ComponentFixture<PostCardFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostCardFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
