import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../class/Usuario/usuario';

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
    
    if (this.loginForm.invalid) {
      alert("Complete correctamente los campos requeridos");
      return;
    }

    const { usuario, password } = this.loginForm.value;

    const datos = localStorage.getItem('usuarios');
    if (!datos) {
      alert("No hay usuarios registrados");
      return;
    }

    const usuarios: Usuario[] = JSON.parse(datos);

    const encontrado = usuarios.find(u =>
      (u.usuario === usuario || u.email === usuario) && u.password === password
    );
    
    if (!encontrado) {
      alert("Usuario o contraseña incorrectos");
      return;
    }
    
    alert("Bienvenido al sistema")
    localStorage.setItem('logueado', 'true')
    localStorage.setItem('dataSesion', JSON.stringify(encontrado))
    this.router.navigate(['/producto']);
  }

}