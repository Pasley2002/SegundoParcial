import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { carritoServicio } from '../service/carritoServicio';
import { Producto } from '../class/Producto/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})

export class Carrito {

  productos: (Producto & { cantidad: number })[] = [];

  constructor(private carrito: carritoServicio, private router: Router) {
    this.productos = this.carrito.obtener();
  }

  eliminar(id: number) {
    this.carrito.eliminar(id);
    this.productos = this.carrito.obtener();
  }

  actualizarCantidad(id: number, event: Event) {
    const cantidad = +(event.target as HTMLInputElement).value;
    if (cantidad > 0) this.carrito.actualizar(id, cantidad);
  }

  generarFactura() {
    this.router.navigate(['/factura']);
  }

  volver() {
    this.router.navigate(['/producto']);
  }

}