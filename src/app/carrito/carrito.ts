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

  productos: (Producto & { cantidad: number })[] = [];

  constructor(private carrito: carritoServicio, private router: Router) { }

  ngOnInit(): void {
    this.carrito.obtener().subscribe(productos => {
      this.productos = productos;
    });
  }

  eliminar(id: string) {
    this.carrito.eliminar(id).then(() => {
      console.log('Producto eliminado del carrito');
    }).catch(error => {
      console.error('Error al eliminar producto: ', error);
    });
  }

  actualizarCantidad(id: string, event: Event) {
    const cantidad = +(event.target as HTMLInputElement).value;
    if (cantidad > 0) {
      this.carrito.actualizar(id, cantidad).then(() => {
        console.log('Cantidad actualizada');
      }).catch(error => {
        console.error('Error al actualizar la cantidad: ', error);
      });
    }
  }

  generarFactura() {
    this.router.navigate(['/factura']);
  }

  volver() {
    this.router.navigate(['/producto']);
  }
}