import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDeliverableComponent } from '../add-deliverable/add-deliverable.component';

describe('AddDeliverableComponent', () => {
  let component: AddDeliverableComponent;
  let fixture: ComponentFixture<AddDeliverableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDeliverableComponent]
    });
    fixture = TestBed.createComponent(AddDeliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
