import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RessourcestatComponent } from './ressourcestat.component';

describe('RessourcestatComponent', () => {
  let component: RessourcestatComponent;
  let fixture: ComponentFixture<RessourcestatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RessourcestatComponent]
    });
    fixture = TestBed.createComponent(RessourcestatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
