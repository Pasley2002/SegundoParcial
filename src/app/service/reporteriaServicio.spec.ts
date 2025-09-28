import { TestBed } from '@angular/core/testing';

import { ReporteriaServicio } from './reporteriaServicio';

describe('Reporteria', () => {
  let service: ReporteriaServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteriaServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
