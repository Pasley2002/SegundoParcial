import { TestBed } from '@angular/core/testing';

import { bcraServicio } from './bcraServicio';

describe('BcraServicio', () => {
  let service: bcraServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(bcraServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
