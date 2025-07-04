import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router ,RouterModule } from '@angular/router';
import { Usuario } from '../class/Usuario/usuario';

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

    if (this.registroForm.invalid) {
      alert("Complete correctamente los campos requeridos");
      return;
    }

    const { usuario, email, password } = this.registroForm.value;
    const usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') ?? '[]');
    
    const usuarioExiste = usuarios.some(u => u.usuario === usuario || u.email === email);
    if (usuarioExiste) {
      alert('El usuario o email ya está registrado');
      return;
    }

    const nuevoUsuario = new Usuario();
    nuevoUsuario.usuario = usuario;
    nuevoUsuario.email = email;
    nuevoUsuario.password = password;

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuario registrado correctamente');
    this.router.navigate(['/login']);
  }

}
