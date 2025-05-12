import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignefinancetoprojetComponent } from './assignefinancetoprojet.component';

describe('AssignefinancetoprojetComponent', () => {
  let component: AssignefinancetoprojetComponent;
  let fixture: ComponentFixture<AssignefinancetoprojetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignefinancetoprojetComponent]
    });
    fixture = TestBed.createComponent(AssignefinancetoprojetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
