import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { ProductoListado } from './producto-listado/producto-listado';
import { AgregarProducto } from './agregar-producto/agregar-producto';
import { Carrito } from './carrito/carrito';
import { Factura } from './factura/factura';
import { AdminAuthGuard } from './service/admin-auth-guard';
import { authGuard } from './service/auth.guard';

export const routes: Routes = [
    {path: '', component: Login},
    {path: 'login', component: Login},
    {path: 'registro', component: Registro},
    {path: 'producto', component: ProductoListado, canActivate: [authGuard]},
    {path: 'producto/nuevo', component: AgregarProducto, canActivate: [authGuard, AdminAuthGuard]},
    {path: 'producto/editar/:id', component: AgregarProducto, canActivate: [authGuard, AdminAuthGuard]},
    {path: 'carrito', component: Carrito, canActivate: [authGuard, AdminAuthGuard]},
    {path: 'factura', component: Factura, canActivate: [authGuard, AdminAuthGuard]},
    { path: '**', redirectTo: '/login' }
];
