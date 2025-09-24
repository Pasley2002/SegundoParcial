import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../class/Producto/producto';

@Injectable({
  providedIn: 'root'
})
export class carritoServicio {
  private productosSubject = new BehaviorSubject<(Producto & { cantidad: number })[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor() {
    const guardado = localStorage.getItem('carrito');
    if (guardado) {
      this.productosSubject.next(JSON.parse(guardado));
    }
  }

  private guardarEnStorage(productos: (Producto & { cantidad: number })[]) {
    localStorage.setItem('carrito', JSON.stringify(productos));
  }

  agregar(producto: Producto, cantidad: number = 1) {
    const actual = this.productosSubject.value;
    const encontrado = actual.find(p => p.id === producto.id);

    let actualizado;
    if (encontrado) {
      actualizado = actual.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p
      );
    } else {
      actualizado = [...actual, { ...producto, cantidad }];
    }

    this.productosSubject.next(actualizado);
    this.guardarEnStorage(actualizado);
  }

  obtener() {
    return this.productos$;
  }

  eliminar(id: string) {
    const actual = this.productosSubject.value.filter(p => p.id !== id);
    this.productosSubject.next(actual);
    this.guardarEnStorage(actual);
  }

  actualizar(id: string, cantidad: number) {
    const actual = this.productosSubject.value.map(p =>
      p.id === id ? { ...p, cantidad } : p
    );
    this.productosSubject.next(actual);
    this.guardarEnStorage(actual);
  }

  vaciar() {
    this.productosSubject.next([]);
    localStorage.removeItem('carrito');
  }
}
