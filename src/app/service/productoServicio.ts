import { Injectable } from '@angular/core';
import { Firestore, collection, CollectionReference, DocumentData, getDocs, QuerySnapshot, doc, addDoc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../class/Producto/producto';

@Injectable({
  providedIn: 'root'
})

export class productoServicio {

  private productoCollection: CollectionReference<DocumentData>; // Referencia a la colección 'productos'

  constructor(private firestore: Firestore) {
    // Inicializa la referencia a la colección en Firestore
    this.productoCollection = collection(this.firestore, 'productos');
  }

  // Obtiene todos los productos como Observable
  getProductos(): Observable<Producto[]> {
    return from(getDocs(this.productoCollection)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          ...(doc.data() as Producto), // Datos del producto
          id: doc.id // Agrega el id del documento
        }))
      )
    );
  }

  // Obtiene un producto específico por id
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

  // Agrega un nuevo producto a la colección
  agregarProducto(producto: Producto) {
    return addDoc(this.productoCollection, producto);
  }

  // Actualiza un producto existente
  actualizarProducto(producto: Producto) {
    const docRef = doc(this.firestore, `productos/${producto.id}`);
    const { id, ...productoSinId } = producto;
    return updateDoc(docRef, { ...productoSinId });
  }

  // Elimina un producto por id
  eliminarProducto(id: string) {
    const docRef = doc(this.firestore, `productos/${id}`);
    return deleteDoc(docRef);
  }
}
