import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFinanceComponent } from './update-finance.component';

describe('UpdateFinanceComponent', () => {
  let component: UpdateFinanceComponent;
  let fixture: ComponentFixture<UpdateFinanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateFinanceComponent]
    });
    fixture = TestBed.createComponent(UpdateFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
