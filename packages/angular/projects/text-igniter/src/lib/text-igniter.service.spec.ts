import { TestBed } from '@angular/core/testing';

import { TextIgniterService } from './text-igniter.service';

describe('TextIgniterService', () => {
  let service: TextIgniterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextIgniterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
