import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';
import { first, map } from 'rxjs/operators';

// Guard para rutas que requieren autenticación
export const authGuard: CanActivateFn = (state) => {
  const router = inject(Router); // Inyecta el router para redirecciones
  const authService = inject(AuthService); // Inyecta el servicio de autenticación

  return authService.getUser().pipe(
    first(), // Toma el primer valor emitido y completa
    map(firebaseUser => {
      const isLoggedIn = !!firebaseUser; // True si hay usuario logueado
      if (isLoggedIn) {
        return true; // Permite acceso a la ruta
      } else {
        // Redirige a login y guarda la URL a la que quería acceder
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }
    })
  );
};
