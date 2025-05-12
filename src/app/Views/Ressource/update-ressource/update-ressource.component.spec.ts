import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRessourceComponent } from './update-ressource.component';

describe('UpdateRessourceComponent', () => {
  let component: UpdateRessourceComponent;
  let fixture: ComponentFixture<UpdateRessourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateRessourceComponent]
    });
    fixture = TestBed.createComponent(UpdateRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
