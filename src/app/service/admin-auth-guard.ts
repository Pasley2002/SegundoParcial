import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService,
    private auth: Auth
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    
      return new Observable<boolean | UrlTree>(observer => {
        onAuthStateChanged(this.auth, async (user) => {
          if (user) {
            const rol = await this.authService.getRolUsuario(user.uid);
            if (rol === 0) {
              observer.next(true);
            } else {
              this.router.navigate(['/']);
              observer.next(false);
            }
          } else {
            this.router.navigate(['/login']);
            observer.next(false);
          }
          observer.complete();
        });
      });
  }
}