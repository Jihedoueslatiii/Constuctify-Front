import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemRiskFormComponent } from './problem-risk-form.component';

describe('ProblemRiskFormComponent', () => {
  let component: ProblemRiskFormComponent;
  let fixture: ComponentFixture<ProblemRiskFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProblemRiskFormComponent]
    });
    fixture = TestBed.createComponent(ProblemRiskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
