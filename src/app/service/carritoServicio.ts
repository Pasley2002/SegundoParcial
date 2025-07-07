import { Injectable } from '@angular/core';
import { Producto } from '../class/Producto/producto';

@Injectable({
  providedIn: 'root'
})

export class carritoServicio {

  constructor() {
    const guardado = localStorage.getItem('carrito');
    this.productos = guardado ? JSON.parse(guardado) : [];
  }

  private guardarEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.productos));
  }

  private productos: (Producto & { cantidad: number })[] = [];

  agregar(producto: Producto, cantidad: number = 1) {
    const encontrado = this.productos.find(p => p.id === producto.id);
    if (encontrado) {
      encontrado.cantidad += cantidad;
    } else {
      this.productos.push({ ...producto, cantidad });
    }
    this.guardarEnStorage();
  }

  obtener(): (Producto & { cantidad: number })[] {
    return this.productos;
  }

  eliminar(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
    this.guardarEnStorage();
  }

  actualizar(id: number, cantidad: number) {
    const prod = this.productos.find(p => p.id === id);
    if (prod) {
      prod.cantidad = cantidad;
      this.guardarEnStorage();
    }
  }

  vaciar() {
    this.productos = [];
    localStorage.removeItem('carrito');
  }

}