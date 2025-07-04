import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class bcraServicio {
  
  private url = 'https://dolarapi.com/v1/dolares/blue';

  constructor(private http: HttpClient) {}

  obtenerTipoCambio() {
    return this.http.get<{ venta: number }>(this.url).pipe(
      map(res => res.venta ?? 0)
    );
  }
  
}