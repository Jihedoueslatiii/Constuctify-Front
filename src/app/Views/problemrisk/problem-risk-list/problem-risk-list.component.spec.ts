import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemRiskListComponent } from './problem-risk-list.component';

describe('ProblemRiskListComponent', () => {
  let component: ProblemRiskListComponent;
  let fixture: ComponentFixture<ProblemRiskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProblemRiskListComponent]
    });
    fixture = TestBed.createComponent(ProblemRiskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
