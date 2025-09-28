import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat } from '../chat/chat';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [CommonModule, Chat],
  templateUrl: './chat-pagina.html',
  styleUrls: ['./chat-pagina.css']
})

export class ChatPagina implements OnInit {

  usuarioLogueado!: { usuario: string; rol: string };

  private db;

  constructor() {
    initializeApp(environment.firebase);
    this.db = getFirestore();
  }

  ngOnInit(): void {
    this.cargarUsuarioLogueado();
  }

  async cargarUsuarioLogueado(): Promise<void> {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const q = query(collection(this.db, "usuarios"), where("email", "==", user.email));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          //Extrae el nombre de usuario y el rol
          const docData = snapshot.docs[0].data() as any;
          this.usuarioLogueado = { usuario: docData.usuario, rol: docData.rol };
        } else {
          //Si no encuentra documento en Firestore, usa el email como nombre
          this.usuarioLogueado = { usuario: user.email || 'Usuario', rol: 'Desconocido' };
        }
      }
    });
  }
}
