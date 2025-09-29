import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../class/Usuario/usuario';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private user: Observable<any>; //Observable que emite cambios de estado de autenticación

  constructor(private auth: Auth, private firestore: Firestore) {
    //Crea un observable que emite el usuario actual cuando cambia el estado de autenticación
    this.user = new Observable(subscriber => {
      onAuthStateChanged(this.auth, (user) => {
        subscriber.next(user);
      });
    });
  }

  //Obtiene el rol de un usuario desde Firestore
  async getRolUsuario(uid: string): Promise<string | null> {
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

  //Obtiene los datos completos de un usuario desde Firestore
  async getUsuarioData(uid: string): Promise<any | null> {
    try {
      const userDocRef = doc(this.firestore, `usuarios/${uid}`);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data();
      } else {
        console.warn("No se encontraron datos para el usuario con UID:", uid);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      return null;
    }
  }

  //Registra un nuevo usuario con email, contraseña y rol
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

  //Login de usuario con email y contraseña
  login({ email, password }: Usuario): Promise<void> {
    if (!password) {
      return Promise.reject(new Error("La contraseña es requerida."));
    }
    return signInWithEmailAndPassword(this.auth, email, password).then(() => {
    }).catch((error) => {
      throw new Error(error.message);
    });
  }

  //Cierra sesión del usuario actual
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  //Devuelve el observable del usuario actual
  getUser(): Observable<any> {
    return this.user;
  }
}
