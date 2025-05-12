import { TestBed } from '@angular/core/testing';

import { ReportSchedulerService } from './report-scheduler.service';

describe('ReportSchedulerService', () => {
  let service: ReportSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
