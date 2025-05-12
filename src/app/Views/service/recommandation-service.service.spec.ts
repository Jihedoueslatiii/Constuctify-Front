import { TestBed } from '@angular/core/testing';

import { RecommandationServiceService } from './recommandation-service.service';

describe('RecommandationServiceService', () => {
  let service: RecommandationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommandationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
