import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTeamDialogComponent } from './select-team-dialog.component';

describe('SelectTeamDialogComponent', () => {
  let component: SelectTeamDialogComponent;
  let fixture: ComponentFixture<SelectTeamDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectTeamDialogComponent]
    });
    fixture = TestBed.createComponent(SelectTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
