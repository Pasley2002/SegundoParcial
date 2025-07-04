import { TestBed } from '@angular/core/testing';

import { carritoServicio } from './carritoServicio';

describe('CarritoServicio', () => {
  let service: carritoServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(carritoServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
