import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc } from '@angular/fire/firestore';
import { Producto } from '../class/Producto/producto';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class facturaServicio {

  constructor(private firestore: Firestore, private auth: Auth) {}

  async guardarFactura(
    productos: (Producto & { cantidad: number })[],
    totalARS: number,
    totalUSD: number
  ) {
    const user = this.auth.currentUser;
    if (!user) return;

    const usuarioRef = doc(this.firestore, 'usuarios', user.uid);
    const usuarioSnap = await getDoc(usuarioRef);

    let nombreUsuario = 'SinNombre';
    if (usuarioSnap.exists()) {
      const datos = usuarioSnap.data() as any;
      nombreUsuario = datos.usuario || 'SinNombre';
    }

    const facturasRef = collection(this.firestore, 'facturas');
    return addDoc(facturasRef, {
      usuarioId: user.uid,
      nombreUsuario,
      productos,
      totalARS,
      totalUSD,
      fecha: new Date().toISOString()
    });
  }

}
