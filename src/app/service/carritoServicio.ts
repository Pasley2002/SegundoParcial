import { Injectable } from '@angular/core';
import { Producto } from '../class/Producto/producto';

@Injectable({
  providedIn: 'root'
})

export class carritoServicio {
  private productos: (Producto & { cantidad: number })[] = [];

  agregar(producto: Producto, cantidad: number = 1) {
    const encontrado = this.productos.find(p => p.id === producto.id);
    encontrado ? encontrado.cantidad += cantidad : this.productos.push({ ...producto, cantidad });
  }

  obtener(): (Producto & { cantidad: number })[] {
    return this.productos;
  }

  eliminar(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
  }

  actualizar(id: number, cantidad: number) {
    const prod = this.productos.find(p => p.id === id);
    if (prod) prod.cantidad = cantidad;
  }

  vaciar() {
    this.productos = [];
  }

}