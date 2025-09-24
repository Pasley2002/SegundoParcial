import { Component, OnInit } from '@angular/core';
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

export class Carrito implements OnInit {

  productos: (Producto & { cantidad: number })[] = []; // Lista de productos con cantidad

  constructor(private carrito: carritoServicio, private router: Router) { }

  ngOnInit(): void {
    // Suscripción para obtener los productos del carrito
    this.carrito.obtener().subscribe(productos => {
      this.productos = productos;
    });
  }

  eliminar(id: string) {
    this.carrito.eliminar(id);
    console.log('Producto eliminado del carrito');
  }

  actualizarCantidad(id: string, event: Event) {
    const cantidad = +(event.target as HTMLInputElement).value;
    if (cantidad > 0) {
      this.carrito.actualizar(id, cantidad);
      console.log('Cantidad actualizada');
    }
  }

  generarFactura() {
    this.router.navigate(['/factura']);
  }

  volver() {
    this.router.navigate(['/producto']);
  }
}
