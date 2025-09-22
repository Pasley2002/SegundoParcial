import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth';
import { Usuario } from '../class/Usuario/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  loginForm: FormGroup;

  constructor( private router: Router, private authService: AuthService ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  // Función para iniciar sesión
  async login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        await this.authService.login({ email, password } as Usuario);
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: '¡Has iniciado sesión correctamente!',
          confirmButtonText: 'Continuar'
        }).then(() => {
          this.router.navigate(['/producto']);
        });

      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'Usuario o contraseña incorrectos.',
          confirmButtonText: 'Reintentar'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Formulario Inválido',
        text: 'Por favor, ingresa un correo y contraseña válidos.',
        confirmButtonText: 'OK'
      });
    }
  }

}
