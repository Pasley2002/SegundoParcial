import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router ,RouterModule } from '@angular/router';
import { Usuario } from '../class/Usuario/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  registroForm: FormGroup;

  constructor(private router: Router) {
    this.registroForm = new FormGroup({
      usuario: new FormControl('', [Validators.required]),
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  registrar() {

    const { usuario, email, password } = this.registroForm.value;
    const usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') ?? '[]');
    
    const usuarioExiste = usuarios.some(u => u.usuario === usuario || u.email === email);
    if (usuarioExiste) {
      Swal.fire({
        icon: 'error',
        title: 'Usuario existente',
        text: 'El usuario o email ya está registrado.',
        confirmButtonText: 'Reintentar'
      });
      return;
    }

    const nuevoUsuario = new Usuario();
    nuevoUsuario.usuario = usuario;
    nuevoUsuario.email = email;
    nuevoUsuario.password = password;

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: 'Usuario registrado correctamente.',
      confirmButtonText: 'Ir al login'
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

}
