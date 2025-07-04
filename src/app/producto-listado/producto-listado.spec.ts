import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoListado } from './producto-listado';

describe('ProductoListado', () => {
  let component: ProductoListado;
  let fixture: ComponentFixture<ProductoListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoListado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoListado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});