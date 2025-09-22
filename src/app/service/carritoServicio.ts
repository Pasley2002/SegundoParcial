import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, writeBatch } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Producto } from '../class/Producto/producto';

@Injectable({
  providedIn: 'root'
})

export class carritoServicio {

  private carritoCollection; // Referencia a la colección 'carrito'

  constructor(private firestore: Firestore) {
    // Inicializa la referencia a la colección en Firestore
    this.carritoCollection = collection(this.firestore, 'carrito');
  }

  // Agrega un producto al carrito con cantidad
  agregar(producto: Producto, cantidad: number = 1) {
    const itemCarrito = { ...producto, cantidad };
    return addDoc(this.carritoCollection, itemCarrito);
  }

  // Obtiene todos los productos del carrito
  obtener(): Observable<(Producto & { cantidad: number })[]> {
    return from(getDocs(this.carritoCollection)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({
        ...(doc.data() as Producto),
        cantidad: 0 // inicializamos cantidad en 0
      })))
    );
  }

  eliminar(id: string) {
    const docRef = doc(this.firestore, `carrito/${id}`);
    return deleteDoc(docRef);
  }

  actualizar(id: string, cantidad: number) {
    const docRef = doc(this.firestore, `carrito/${id}`);
    return updateDoc(docRef, { cantidad });
  }

  // Vacía todo el carrito usando batch
  async vaciar() {
    const batch = writeBatch(this.firestore);
    const querySnapshot = await getDocs(this.carritoCollection);

    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    return batch.commit(); // Ejecuta todas las eliminaciones en batch
  }
}
