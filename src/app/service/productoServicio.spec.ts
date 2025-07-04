import { TestBed } from '@angular/core/testing';

import { Producto } from './productoServicio';

describe('Producto', () => {
  let service: Producto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Producto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
