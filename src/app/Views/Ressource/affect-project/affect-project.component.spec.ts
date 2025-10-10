import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectProjectComponent } from './affect-project.component';

describe('AffectProjectComponent', () => {
  let component: AffectProjectComponent;
  let fixture: ComponentFixture<AffectProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffectProjectComponent]
    });
    fixture = TestBed.createComponent(AffectProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
