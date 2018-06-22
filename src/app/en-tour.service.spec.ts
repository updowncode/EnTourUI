import { TestBed, inject } from '@angular/core/testing';

import { EnTourService } from './en-tour.service';

describe('EnTourService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnTourService]
    });
  });

  it('should be created', inject([EnTourService], (service: EnTourService) => {
    expect(service).toBeTruthy();
  }));
});
