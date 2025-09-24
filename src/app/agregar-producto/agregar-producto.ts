import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { productoServicio } from '../service/productoServicio';
import { carritoServicio } from '../service/carritoServicio';
import { FormsModule } from '@angular/forms';
import { Producto } from '../class/Producto/producto';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './agregar-producto.html',
  styleUrls: ['./agregar-producto.css']
})

export class AgregarProducto implements OnInit {

  productoForm: FormGroup;
  modoEdicion: boolean = false;
  productoId?: string;

  constructor(private fb: FormBuilder, private productoServicio: productoServicio, private carritoServicio: carritoServicio, private router: Router, private route: ActivatedRoute) {
    this.productoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      imagen: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.productoId = params.get('id') ?? undefined;
        this.modoEdicion = !!this.productoId;
        if (this.modoEdicion && this.productoId) {
          return this.productoServicio.getProducto(this.productoId);
        }
        return of(null);
      })
    ).subscribe((producto: Producto | null) => {
      if (producto) {
        this.productoForm.patchValue(producto);
      }
    });}

  guardar() {
    let producto = this.productoForm.value;

    if (this.modoEdicion && this.productoId) {
      producto = { ...producto, id: this.productoId };
      this.productoServicio.actualizarProducto(producto).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          text: 'El producto fue actualizado correctamente.',
          confirmButtonText: 'Continuar'
        }).then(() => {
          this.router.navigate(['/producto']);
        });

      }).catch(error => {
        console.error("Error al actualizar el producto: ", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar el producto.',
          confirmButtonText: 'OK'
        });
      });

    } else {
      this.productoServicio.agregarProducto(producto).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Producto agregado',
          text: 'El producto fue agregado correctamente.',
          confirmButtonText: 'Ver listado'
        }).then(() => {
          this.router.navigate(['/producto']);
        });

      }).catch(error => {
        console.error("Error al agregar el producto: ", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al agregar el producto.',
          confirmButtonText: 'OK'
        });
      });
    }
  }

  cancelar() {
    this.router.navigate(['/producto']);
  }
}
