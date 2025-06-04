import { TestBed } from '@angular/core/testing';

import { StormglassService } from './stormglass.service';

describe('StormglassService', () => {
  let service: StormglassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StormglassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
