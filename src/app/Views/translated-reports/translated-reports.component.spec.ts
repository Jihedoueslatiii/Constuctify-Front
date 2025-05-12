import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatedReportsComponent } from './translated-reports.component';

describe('TranslatedReportsComponent', () => {
  let component: TranslatedReportsComponent;
  let fixture: ComponentFixture<TranslatedReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranslatedReportsComponent]
    });
    fixture = TestBed.createComponent(TranslatedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
