import { Injectable } from '@angular/core';
import { Producto } from '../class/Producto/producto';

@Injectable({
  providedIn: 'root'
})

export class productoServicio {

  private _productos: Producto[];

  constructor() {
    this._productos = JSON.parse(localStorage.getItem('productos') ?? '[]');
  }

  public get Productos(): Producto[] {
    return this._productos;
  }

  public getProductos(): void {
    this._productos = JSON.parse(localStorage.getItem('productos') ?? '[]');
  }

  public setProductos(productos: Producto[]): void {
    this._productos = productos;
    localStorage.setItem('productos', JSON.stringify(this._productos));
  }

  public agregarProducto(producto: Producto): void {
    producto.id = this.generarId();
    this._productos.push(producto);
    this.setProductos(this._productos);
  }

  public actualizarProducto(productoActualizado: Producto): void {
    const index = this._productos.findIndex(p => p.id === productoActualizado.id);
    if (index !== -1) {
      this._productos[index] = productoActualizado;
      this.setProductos(this._productos);
    }
  }
  
  private generarId(): number {
    if (this._productos.length === 0) return 1;
    return Math.max(...this._productos.map(p => p.id ?? 0)) + 1;
  }

}