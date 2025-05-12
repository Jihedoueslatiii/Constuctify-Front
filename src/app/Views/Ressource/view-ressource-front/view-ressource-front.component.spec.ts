import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRessourceFrontComponent } from './view-ressource-front.component';

describe('ViewRessourceFrontComponent', () => {
  let component: ViewRessourceFrontComponent;
  let fixture: ComponentFixture<ViewRessourceFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRessourceFrontComponent]
    });
    fixture = TestBed.createComponent(ViewRessourceFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
