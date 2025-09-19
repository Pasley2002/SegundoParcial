import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../class/Usuario/usuario';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private usuarioCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.usuarioCollection = collection(this.firestore, 'usuarios');
  }

  getUsuarios(): Observable<Usuario[]> {
    return collectionData(this.usuarioCollection, { idField: 'id' }) as Observable<Usuario[]>;
  }
}