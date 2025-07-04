import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../class/Producto/producto';
import { bcraServicio } from '../service/bcraServicio';
import { carritoServicio } from '../service/carritoServicio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura.html',
  styleUrls: ['./factura.css']
})

export class Factura implements OnInit {

  @Input() productosSeleccionados: (Producto & { cantidad: number })[] = [];
  @Output() compraConfirmada = new EventEmitter<void>();

  tipoCambioUSD: number = 350;
  nombreUsuario: string = '';

  constructor(private bcraService: bcraServicio, private carritoService: carritoServicio, private router: Router) {}

  ngOnInit(): void {
    this.productosSeleccionados = this.carritoService.obtener();

    this.bcraService.obtenerTipoCambio().subscribe(valor => {
      this.tipoCambioUSD = valor;
    });

    const sesion = localStorage.getItem('dataSesion');
    if (sesion) {
      const usuario = JSON.parse(sesion);
      this.nombreUsuario = usuario.nombre || usuario.email;
    }
  }

  obtenerTotalARS(): number {
    return this.productosSeleccionados.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  }

  obtenerTotalUSD(): number {
    return +(this.obtenerTotalARS() / this.tipoCambioUSD).toFixed(2);
  }

  confirmarCompra(): void {
    this.carritoService.vaciar();
    this.compraConfirmada.emit();
    alert('¡Compra realizada con éxito!');
    this.router.navigate(['/producto']);
  }

}