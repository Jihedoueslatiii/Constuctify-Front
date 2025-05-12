import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTeamComponent } from './list-team.component';

describe('ListTeamComponent', () => {
  let component: ListTeamComponent;
  let fixture: ComponentFixture<ListTeamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTeamComponent]
    });
    fixture = TestBed.createComponent(ListTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
