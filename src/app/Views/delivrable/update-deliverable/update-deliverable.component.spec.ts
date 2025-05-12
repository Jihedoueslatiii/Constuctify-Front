import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDeliverableComponent } from './update-deliverable.component';

describe('UpdateDeliverableComponent', () => {
  let component: UpdateDeliverableComponent;
  let fixture: ComponentFixture<UpdateDeliverableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateDeliverableComponent]
    });
    fixture = TestBed.createComponent(UpdateDeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
