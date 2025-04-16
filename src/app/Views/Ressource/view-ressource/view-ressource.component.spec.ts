import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRessourceComponent } from './view-ressource.component';

describe('ViewRessourceComponent', () => {
  let component: ViewRessourceComponent;
  let fixture: ComponentFixture<ViewRessourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewRessourceComponent]
    });
    fixture = TestBed.createComponent(ViewRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
