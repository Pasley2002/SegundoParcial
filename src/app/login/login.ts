import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../class/Usuario/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  login() {

    const { usuario, password } = this.loginForm.value;

    const datos = localStorage.getItem('usuarios');
    if (!datos) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin registros',
        text: 'No hay usuarios registrados.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const usuarios: Usuario[] = JSON.parse(datos);

    const encontrado = usuarios.find(u =>
      u.usuario === usuario && u.password === password
    );
    
    if (!encontrado) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Usuario o contraseña incorrectos.',
        confirmButtonText: 'Reintentar'
      });
      return;
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      text: `Hola ${encontrado.usuario || 'usuario'} 👋`,
      confirmButtonText: 'Continuar'
    }).then(() => {
      localStorage.setItem('logueado', 'true');
      localStorage.setItem('dataSesion', JSON.stringify(encontrado));
      this.router.navigate(['/producto']);
    });
  }

}