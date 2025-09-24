import { Component, OnInit } from '@angular/core';
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
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, FiltroPipe, FormsModule],
  templateUrl: './producto-listado.html',
  styleUrl: './producto-listado.css'
})

export class ProductoListado implements OnInit {

  productos: Producto[] = []; // Lista de productos
  filtro: string = '';
  productosCarrito: (Producto & { cantidad: number })[] = [];

  constructor(private router: Router, private productoServicio: productoServicio, public carritoServicio: carritoServicio) {
    const data = localStorage.getItem('productos');
    this.productos = data ? JSON.parse(data) : [];
  }

  ngOnInit(): void {
    this.productoServicio.getProductos().subscribe(productos => {
      this.productos = productos;
    });

    this.carritoServicio.obtener().subscribe(productos => {
      this.productosCarrito = productos;
    });
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

  editar(producto: any) {
    this.router.navigate(['/producto/editar', producto.id]);
  }

  eliminar(id: any) {
    if (!id) {
      console.error("No se pudo obtener el ID del producto para eliminar.");
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoServicio.eliminarProducto(id).then(() => {
          Swal.fire(
            '¡Eliminado!',
            'El producto ha sido eliminado.',
            'success'
          );

          this.productoServicio.getProductos().subscribe(productos => {
            this.productos = productos;
          });

        }).catch(error => {
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar el producto.',
            'error'
          );
          console.error(error);
        });
      }
    });
  }

}
