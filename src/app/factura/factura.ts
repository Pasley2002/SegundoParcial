import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../class/Producto/producto';
import { bcraServicio } from '../service/bcraServicio';
import { carritoServicio } from '../service/carritoServicio';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Auth } from '@angular/fire/auth';
import { facturaServicio } from '../service/facturaServicio';
import { jsPDF } from 'jspdf';
import { doc, getDoc, Firestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { initializeApp } from "firebase/app";

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

  constructor(private bcraService: bcraServicio, private carritoService: carritoServicio, private router: Router, private auth: Auth, private facturaServicio: facturaServicio, private firestore: Firestore) {
    initializeApp(environment.firebase);
  }

  ngOnInit(): void {
    this.carritoService.obtener().subscribe(productos => {
      this.productosSeleccionados = productos;
    });

    this.bcraService.obtenerTipoCambio().subscribe(valor => {
      this.tipoCambioUSD = valor;
    });

  }

  obtenerTotalARS(): number {
    return this.productosSeleccionados.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  }

  obtenerTotalUSD(): number {
    return +(this.obtenerTotalARS() / this.tipoCambioUSD).toFixed(2);
  }

  private async cargarNombreUsuario(): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) return 'Usuario';

    const usuarioRef = doc(this.firestore, 'usuarios', user.uid);
    const usuarioSnap = await getDoc(usuarioRef);

    if (usuarioSnap.exists()) {
      const datos = usuarioSnap.data() as any;
      return datos.usuario || user.displayName || 'Usuario';
    }
    return user.displayName || 'Usuario';
  }

  async confirmarCompra(): Promise<void> {
    const productos = [...this.productosSeleccionados];
    const totalARS = this.obtenerTotalARS();
    const totalUSD = this.obtenerTotalUSD();

    await this.facturaServicio.guardarFactura(productos, totalARS, totalUSD);
    this.nombreUsuario = await this.cargarNombreUsuario();

    await this.downloadCSV(productos, totalARS, totalUSD);

    await this.carritoService.vaciar();
    this.compraConfirmada.emit();

    Swal.fire({
      icon: 'success',
      title: '¡Compra realizada con éxito!',
      text: 'Gracias por tu compra 🙌',
      confirmButtonText: 'Volver al catálogo'
    }).then(() => {
      this.router.navigate(['/producto']);
    });
  }

  async downloadCSV(
    productos: (Producto & { cantidad: number })[],
    totalARS: number,
    totalUSD: number
  ) {
    const encabezados = ["Producto", "Cantidad", "Precio ARS", "Total ARS", "Total USD"];

    const filas = productos.map(p =>
      `${p.nombre};${p.cantidad};${p.precio};${p.precio * p.cantidad};${(p.precio * p.cantidad / this.tipoCambioUSD).toFixed(2)}`
    );

    filas.push(`Total;;;${totalARS};${totalUSD}`);

    // Armamos contenido CSV
    const contenido = [
      `Usuario:;${this.nombreUsuario}`,
      `Fecha:;${new Date().toLocaleString()}`,
      "", // línea vacía para separar cabecera
      encabezados.join(";"),
      ...filas
    ].join("\n");

    // Descarga del archivo
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Factura_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  volver() {
    this.router.navigate(['/carrito']);
  }

}
