import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UsuarioService } from '../service/usuario';
import { Usuario } from '../class/Usuario/usuario';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-usuario-listado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-listado.html',
  styleUrls: ['./usuario-listado.css']
})
export class UsuarioListadoComponent implements OnInit {

  usuarios$!: Observable<Usuario[]>;

  constructor(
    private usuarioService: UsuarioService,
    private auth: Auth
  ) { }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.usuarios$ = this.usuarioService.getUsuarios();
      }
    });
  }
}