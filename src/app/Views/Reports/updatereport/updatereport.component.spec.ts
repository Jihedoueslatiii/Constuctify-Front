import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatereportComponent } from './updatereport.component';

describe('UpdatereportComponent', () => {
  let component: UpdatereportComponent;
  let fixture: ComponentFixture<UpdatereportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatereportComponent]
    });
    fixture = TestBed.createComponent(UpdatereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
