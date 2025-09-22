import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../class/Producto/producto';
import { bcraServicio } from '../service/bcraServicio';
import { carritoServicio } from '../service/carritoServicio';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth'; // Importa Auth, getAuth, y onAuthStateChanged

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura.html',
  styleUrls: ['./factura.css']
})

export class Factura implements OnInit {

  productosSeleccionados: (Producto & { cantidad: number })[] = [];
  @Output() compraConfirmada = new EventEmitter<void>();

  tipoCambioUSD: number = 350;
  nombreUsuario: string = '';

  constructor( private bcraService: bcraServicio, private carritoService: carritoServicio, private router: Router, private auth: Auth) {}

  ngOnInit(): void {
    this.carritoService.obtener().subscribe(productos => {
      this.productosSeleccionados = productos;
    });

    this.bcraService.obtenerTipoCambio().subscribe(valor => {
      this.tipoCambioUSD = valor;
    });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.nombreUsuario = user.displayName || 'Usuario';
      } else {
        this.nombreUsuario = 'Usuario';
      }
    });
  }

  obtenerTotalARS(): number {
    return this.productosSeleccionados.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  }

  obtenerTotalUSD(): number {
    return +(this.obtenerTotalARS() / this.tipoCambioUSD).toFixed(2);
  }

  async confirmarCompra(): Promise<void> {
    await this.carritoService.vaciar();

    this.compraConfirmada.emit();
    Swal.fire({
      icon: 'success',
      title: '¡Compra realizada con éxito!',
      text: 'Gracias por tu compra, ' + this.nombreUsuario + ' 🙌',
      confirmButtonText: 'Volver al catálogo'
    }).then(() => {
      this.router.navigate(['/producto']);
    });
  }
}
