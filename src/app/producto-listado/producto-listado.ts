import { Component } from '@angular/core';
import { Producto } from '../class/Producto/producto';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { productoServicio } from '../service/productoServicio';
import { MatIconModule } from '@angular/material/icon';
import { FiltroPipe } from '../pipe/filtro-pipe';
import { FormsModule } from '@angular/forms';
import { carritoServicio } from '../service/carritoServicio';

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
    alert(`${producto.nombre} fue agregado al carrito`);
  }

  editar(producto: Producto) {
    localStorage.setItem('productoEditar', JSON.stringify(producto));
    this.router.navigate(['/producto/nuevo']);
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que querés eliminar este producto?')) {
      this.productos = this.productos.filter(p => p.id !== id);
      this.productoServicio.setProductos(this.productos);
    }
  }

}