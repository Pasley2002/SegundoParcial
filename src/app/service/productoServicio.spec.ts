import { TestBed } from '@angular/core/testing';
import { productoServicio } from './productoServicio';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

const firestoreMock = {
  collection: () => ({
    valueChanges: () => of([])
  })
};

describe('productoServicio', () => {
  let service: productoServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        productoServicio,
        { provide: Firestore, useValue: firestoreMock }
      ]
    });
    service = TestBed.inject(productoServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});