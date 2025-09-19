import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Registro } from './registro/registro';
import { ProductoListado } from './producto-listado/producto-listado';
import { AgregarProducto } from './agregar-producto/agregar-producto';
import { Carrito } from './carrito/carrito';
import { Factura } from './factura/factura';
import { UsuarioListadoComponent } from './usuario-listado/usuario-listado';
import { AdminAuthGuard } from './service/admin-auth-guard';

export const routes: Routes = [
    {path: '', component: Login},
    {path: 'login', component: Login},
    {path: 'registro', component: Registro},
    {path: 'producto', component: ProductoListado},
    {path: 'producto/nuevo', component: AgregarProducto},
    {path: 'producto/editar/:id', component: AgregarProducto},
    {path: 'carrito', component: Carrito},
    {path: 'factura', component: Factura},
    {path: 'usuarios', component: UsuarioListadoComponent, canActivate: [AdminAuthGuard]}
];