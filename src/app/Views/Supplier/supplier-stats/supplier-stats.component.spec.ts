import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierStatsComponent } from './supplier-stats.component';

describe('SupplierStatsComponent', () => {
  let component: SupplierStatsComponent;
  let fixture: ComponentFixture<SupplierStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierStatsComponent]
    });
    fixture = TestBed.createComponent(SupplierStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
