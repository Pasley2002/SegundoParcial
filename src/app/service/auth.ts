import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../class/Usuario/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user = new Observable(subscriber => {
      onAuthStateChanged(this.auth, (user) => {
        subscriber.next(user);
      });
    });
  }

  async getRolUsuario(uid: string): Promise<number | null> {
  try {
    const userDocRef = doc(this.firestore, `usuarios/${uid}`);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data()['rol'];
    } else {
      console.warn("No se encontró el rol para el usuario con UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el rol del usuario:", error);
    return null;
  }
}

  async register({ email, password, usuario, rol }: Usuario): Promise<void> {
    if (!password) {
      throw new Error("La contraseña es requerida.");
    }
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
      const userDocRef = doc(this.firestore, `usuarios/${uid}`);
      await setDoc(userDocRef, {
        usuario: usuario,
        email: email,
        rol: rol
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  login({ email, password }: Usuario): Promise<void> {
    if (!password) {
      return Promise.reject(new Error("La contraseña es requerida."));
    }
    return signInWithEmailAndPassword(this.auth, email, password).then(() => {
    }).catch((error) => {
      throw new Error(error.message);
    });
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getUser(): Observable<any> {
    return this.user;
  }
}