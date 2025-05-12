import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleCreatorComponent } from './schedule-creator.component';

describe('ScheduleCreatorComponent', () => {
  let component: ScheduleCreatorComponent;
  let fixture: ComponentFixture<ScheduleCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleCreatorComponent]
    });
    fixture = TestBed.createComponent(ScheduleCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
