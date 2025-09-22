import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth';
import { Usuario } from '../class/Usuario/usuario';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})

export class Registro {

  registroForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.registroForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      rol: new FormControl(1) // El rol por defecto será 1 (usuario normal)
    });
  }

  // Función para registrar un nuevo usuario
  async registrar() {
    if (this.registroForm.valid) {
      try {
        const nuevoUsuario: Usuario = this.registroForm.value;
        await this.authService.register(nuevoUsuario);

        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Usuario registrado correctamente.',
          confirmButtonText: 'Ir al login'
        }).then(() => {
          this.router.navigate(['/login']);
        });

      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error de registro',
          text: error.message,
          confirmButtonText: 'Reintentar'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
        confirmButtonText: 'OK'
      });
    }
  }

}
