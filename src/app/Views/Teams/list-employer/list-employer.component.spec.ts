import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployerComponent } from './list-employer.component';

describe('ListEmployerComponent', () => {
  let component: ListEmployerComponent;
  let fixture: ComponentFixture<ListEmployerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListEmployerComponent]
    });
    fixture = TestBed.createComponent(ListEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
