import { TestBed } from '@angular/core/testing';

import { FacturaServicio } from './facturaServicio';

describe('FacturaServicio', () => {
  let service: FacturaServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturaServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
