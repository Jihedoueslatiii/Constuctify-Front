import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeliverableComponent } from './view-deliverable.component';

describe('ViewDeliverableComponent', () => {
  let component: ViewDeliverableComponent;
  let fixture: ComponentFixture<ViewDeliverableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewDeliverableComponent]
    });
    fixture = TestBed.createComponent(ViewDeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
