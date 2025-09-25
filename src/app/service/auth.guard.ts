import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';
import { first, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getUser().pipe(
    first(),
    map(firebaseUser => {
      const isLoggedIn = !!firebaseUser;
      if (isLoggedIn) {
        return true;
      } else {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }
    })
  );
};
