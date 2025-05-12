import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewfrontComponent } from './viewfront.component';

describe('ViewfrontComponent', () => {
  let component: ViewfrontComponent;
  let fixture: ComponentFixture<ViewfrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewfrontComponent]
    });
    fixture = TestBed.createComponent(ViewfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
