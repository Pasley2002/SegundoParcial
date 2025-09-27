import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat {

  public mensajes: Array<any> = [];
  public texto: string = "";

  private app;
  private db;

  @Input() usuarioActual!: { usuario: string, rol: string };

  constructor(private router: Router) {
    this.app = initializeApp(environment.firebase);
    this.db = getFirestore(this.app);

    const mensajesRef = collection(this.db, "Mensajes");
    const q = query(mensajesRef, orderBy("fecha", "asc"));

    onSnapshot(q, (snapshot) => {
      this.mensajes = [];
      snapshot.forEach(doc => {
        this.mensajes.push(doc.data());
      });
    });
  }

  async agregar() {
    if (!this.texto || !this.usuarioActual) return;

    try {
      await addDoc(collection(this.db, "Mensajes"), {
        remitente: {
          usuario: this.usuarioActual.usuario,
          rol: this.usuarioActual.rol
        },
        texto: this.texto,
        fecha: serverTimestamp()
      });
      this.texto = "";
    } catch (e) {
      console.error("Error agregando mensaje:", e);
    }
  }

  volver() {
    this.router.navigate(['/producto']);
  }
}
