import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../class/Producto/producto';
import { bcraServicio } from '../service/bcraServicio';
import { carritoServicio } from '../service/carritoServicio';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Auth, getAuth, onAuthStateChanged, User } from '@angular/fire/auth';
import { facturaServicio } from '../service/facturaServicio';
import { jsPDF } from 'jspdf';
import { doc, getDoc, Firestore } from '@angular/fire/firestore';
import { Chat } from '../chat/chat';
import { environment } from '../../environments/environment';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, Chat],
  templateUrl: './factura.html',
  styleUrls: ['./factura.css']
})

export class Factura implements OnInit {

  usuarioLogueado!: { usuario: string, rol: string };

  productosSeleccionados: (Producto & { cantidad: number })[] = [];
  @Output() compraConfirmada = new EventEmitter<void>();

  tipoCambioUSD: number = 350;
  nombreUsuario: string = '';
  private db;

  constructor(private bcraService: bcraServicio, private carritoService: carritoServicio, private router: Router, private auth: Auth, private facturaServicio: facturaServicio, private firestore: Firestore) {
    initializeApp(environment.firebase);
    this.db = getFirestore();
  }

  ngOnInit(): void {
    this.carritoService.obtener().subscribe(productos => {
      this.productosSeleccionados = productos;
    });

    this.bcraService.obtenerTipoCambio().subscribe(valor => {
      this.tipoCambioUSD = valor;
    });

    this.cargarUsuarioLogueado();
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
    await this.downloadPDF(productos, totalARS, totalUSD);

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

  async downloadPDF(
    productos: (Producto & { cantidad: number })[],
    totalARS: number,
    totalUSD: number
  ) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = margin;

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Factura', pageWidth / 2, y, { align: 'center' });
    y += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Usuario: ${this.nombreUsuario}`, margin, y);
    pdf.text(`Fecha: ${new Date().toLocaleString()}`, pageWidth - margin, y, { align: 'right' });
    y += 10;

    pdf.setFillColor(200, 200, 200);
    pdf.rect(margin, y - 4, pageWidth - 2 * margin, 7, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.text('Producto', margin + 2, y);
    pdf.text('Cant.', 80, y);
    pdf.text('Precio ARS', 110, y);
    pdf.text('Total ARS', 145, y);
    pdf.text('Total USD', 180, y);

    y += 6;
    pdf.setFont('helvetica', 'normal');

    for (const p of productos) {
      if (y > pageHeight - 20) {
        pdf.addPage();
        y = margin;

        pdf.setFillColor(200, 200, 200);
        pdf.rect(margin, y - 4, pageWidth - 2 * margin, 7, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.text('Producto', margin + 2, y);
        pdf.text('Cant.', 80, y);
        pdf.text('Precio ARS', 110, y);
        pdf.text('Total ARS', 145, y);
        pdf.text('Total USD', 180, y);
        pdf.setFont('helvetica', 'normal');
        y += 6;
      }

      pdf.rect(margin, y - 5, pageWidth - 2 * margin, 6);

      pdf.text(p.nombre, margin + 2, y);
      pdf.text(`${p.cantidad}`, 80, y);
      pdf.text(`$${p.precio}`, 110, y);
      pdf.text(`$${p.precio * p.cantidad}`, 145, y);
      pdf.text(`$${(p.precio * p.cantidad / this.tipoCambioUSD).toFixed(2)}`, 180, y);
      y += 6;
    }

    y += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Monto Total ARS: $${totalARS}`, margin, y);
    y += 6;
    pdf.text(`Monto Total USD: $${totalUSD}`, margin, y);

    pdf.save(`Factura_${new Date().toISOString().slice(0,10)}.pdf`);
  }

  async cargarUsuarioLogueado(): Promise<void> {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // Buscar en Firestore la colección "usuarios" usando el email
        const q = query(collection(this.db, "usuarios"), where("email", "==", user.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data() as any;
          this.usuarioLogueado = {
            usuario: docData.usuario,
            rol: docData.rol
          };
        } else {
          // Por si no existe en Firestore
          this.usuarioLogueado = {
            usuario: user.displayName || user.email || 'Usuario',
            rol: 'Desconocido'
          };
        }
      } else {
        this.usuarioLogueado = { usuario: 'Invitado', rol: 'Invitado' };
      }
    });
  }

}
