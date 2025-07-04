import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { productoServicio } from '../service/productoServicio';
import { carritoServicio } from '../service/carritoServicio';
import { FormsModule } from '@angular/forms';
import { Producto } from '../class/Producto/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './agregar-producto.html',
  styleUrls: ['./agregar-producto.css']
})
export class AgregarProducto {

  productoForm: FormGroup;
  modoEdicion: boolean = false;

  constructor(private fb: FormBuilder, private productoServicio: productoServicio, private carritoServicio: carritoServicio, private router: Router) {
    this.productoForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      imagen: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]]
    });

    const productoEditado = localStorage.getItem('productoEditar');
    if (productoEditado) {
      this.modoEdicion = true;
      this.productoForm.patchValue(JSON.parse(productoEditado));
      localStorage.removeItem('productoEditar');
    }
  }

  guardar() {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      alert('Por favor complete todos los campos correctamente.');
      return;
    }

    const producto: Producto = this.productoForm.value;

    if (this.modoEdicion) {
      this.productoServicio.actualizarProducto(producto);
      alert('Producto actualizado correctamente');
    } else {
      this.productoServicio.agregarProducto(producto);
      alert('Producto agregado correctamente');
    }

    this.router.navigate(['/producto']);
  }

  cancelar() {
    this.router.navigate(['/producto']);
  }
  
}
