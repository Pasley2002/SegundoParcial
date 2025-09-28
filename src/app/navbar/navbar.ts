import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class NavbarComponent implements OnInit {

  logueado: boolean = false;
  nombreUsuario: string = '';
  esAdmin: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Se suscribe a cambios de autenticación
    this.authService.getUser().subscribe(user => {
      this.logueado = !!user;
      this.esAdmin = false;
      this.nombreUsuario = '';

      if (user) {
        // Obtiene datos adicionales del usuario desde Firestore
        this.authService.getUsuarioData(user.uid).then(userData => {
          if (userData) {
            this.nombreUsuario = userData.usuario || user.email;
            this.esAdmin = userData.rol === 'administrador';
          } else {
            this.nombreUsuario = user.email || '';
          }
        }).catch(error => {
          console.error("Error al obtener datos del usuario:", error);
          this.nombreUsuario = user.email || '';
        });
      }
    });
  }

  // Cierra sesión y redirige al login
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
