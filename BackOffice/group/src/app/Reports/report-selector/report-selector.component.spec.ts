import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSelectorComponent } from './report-selector.component';

describe('ReportSelectorComponent', () => {
  let component: ReportSelectorComponent;
  let fixture: ComponentFixture<ReportSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportSelectorComponent]
    });
    fixture = TestBed.createComponent(ReportSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
