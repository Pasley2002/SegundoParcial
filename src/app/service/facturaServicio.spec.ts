import { TestBed } from '@angular/core/testing';

import { facturaServicio } from './facturaServicio';

describe('FacturaServicio', () => {
  let service: facturaServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(facturaServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
