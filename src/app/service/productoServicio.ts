import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../class/Producto/producto';

@Injectable({
  providedIn: 'root'
})
export class productoServicio {
  private productoCollection;

  constructor(private firestore: Firestore) {
    this.productoCollection = collection(this.firestore, 'productos');
  }

  getProductos(): Observable<Producto[]> {
    return collectionData(this.productoCollection, { idField: 'id' }) as Observable<Producto[]>;
  }

  getProducto(id: string): Observable<Producto | null> {
    const docRef = doc(this.firestore, `productos/${id}`);
    return from(getDoc(docRef)).pipe(
      map(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data() as any;
          return { id: docSnap.id, ...data } as Producto;
        } else {
          return null;
        }
      })
    );
  }

  agregarProducto(producto: Producto) {
    return addDoc(this.productoCollection, producto);
  }

  actualizarProducto(producto: Producto) {
    const docRef = doc(this.firestore, `productos/${producto.id}`);
    const { id, ...productoSinId } = producto;
    return updateDoc(docRef, { ...productoSinId });
  }

  eliminarProducto(id: string) {
    const docRef = doc(this.firestore, `productos/${id}`);
    return deleteDoc(docRef);
  }
}