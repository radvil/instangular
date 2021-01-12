import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostItemFooterComponent } from './post-item-footer.component';

describe('PostItemFooterComponent', () => {
  let component: PostItemFooterComponent;
  let fixture: ComponentFixture<PostItemFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostItemFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostItemFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
