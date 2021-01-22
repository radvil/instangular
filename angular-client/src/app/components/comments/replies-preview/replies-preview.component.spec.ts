import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepliesPreviewComponent } from './replies-preview.component';

describe('RepliesPreviewComponent', () => {
  let component: RepliesPreviewComponent;
  let fixture: ComponentFixture<RepliesPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepliesPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepliesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
