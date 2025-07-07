import { Component } from '@angular/core';
import { Producto } from '../class/Producto/producto';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { productoServicio } from '../service/productoServicio';
import { MatIconModule } from '@angular/material/icon';
import { FiltroPipe } from '../pipe/filtro-pipe';
import { FormsModule } from '@angular/forms';
import { carritoServicio } from '../service/carritoServicio';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-listado',
  imports: [CommonModule, RouterModule, MatIconModule, FiltroPipe, FormsModule],
  templateUrl: './producto-listado.html',
  styleUrl: './producto-listado.css'
})
export class ProductoListado {

  productos: Producto[] = [];
  filtro: string = '';

  constructor(private router: Router, private productoServicio: productoServicio, public carritoServicio: carritoServicio) {
    const data = localStorage.getItem('productos');
    this.productos = data ? JSON.parse(data) : [];
  }

  agregar(producto: Producto) {
    this.carritoServicio.agregar(producto);
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado',
      text: `${producto.nombre} fue agregado al carrito.`,
      timer: 1500,
      showConfirmButton: false
    });
  }

  editar(producto: Producto) {
    localStorage.setItem('productoEditar', JSON.stringify(producto));
    this.router.navigate(['/producto/nuevo']);
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productos = this.productos.filter(p => p.id !== id);
        this.productoServicio.setProductos(this.productos);

        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El producto fue eliminado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

}