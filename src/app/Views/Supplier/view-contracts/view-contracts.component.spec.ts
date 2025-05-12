import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractsComponent } from './view-contracts.component';

describe('ViewContractsComponent', () => {
  let component: ViewContractsComponent;
  let fixture: ComponentFixture<ViewContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewContractsComponent]
    });
    fixture = TestBed.createComponent(ViewContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
