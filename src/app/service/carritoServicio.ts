import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDoc, updateDoc, deleteDoc, getDocs, writeBatch } from '@angular/fire/firestore'; // Asegúrate de importar getDocs y writeBatch
import { Observable, from } from 'rxjs';
import { Producto } from '../class/Producto/producto';
import { collectionData } from 'rxfire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class carritoServicio {

  private carritoCollection;

  constructor(private firestore: Firestore) {
    this.carritoCollection = collection(this.firestore, 'carrito');
  }

  agregar(producto: Producto, cantidad: number = 1) {
    const itemCarrito = { ...producto, cantidad };
    return addDoc(this.carritoCollection, itemCarrito);
  }

  obtener(): Observable<(Producto & { cantidad: number })[]> {
    return collectionData(this.carritoCollection, { idField: 'id' }) as Observable<(Producto & { cantidad: number })[]>;
  }

  eliminar(id: string) {
    const docRef = doc(this.firestore, `carrito/${id}`);
    return deleteDoc(docRef);
  }

  actualizar(id: string, cantidad: number) {
    const docRef = doc(this.firestore, `carrito/${id}`);
    return updateDoc(docRef, { cantidad });
  }

  async vaciar() {
    const batch = writeBatch(this.firestore);
    const querySnapshot = await getDocs(this.carritoCollection);

    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    return batch.commit();
  }
}