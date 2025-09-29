import { Injectable } from '@angular/core';
import { Firestore, collection, query, getDocs, where } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReporteriaServicio {

  constructor(private firestore: Firestore) { }

  private getFacturas(startDate: Date, endDate: Date): Observable<any[]> {
    const facturasRef = collection(this.firestore, 'facturas');

    //Ajuste de fecha de fin
    const dayAfterEndDate = new Date(endDate);
    dayAfterEndDate.setDate(endDate.getDate() + 1);
    dayAfterEndDate.setHours(0, 0, 0, 0);

    //Las fechas se guardan en Firestore como strings ISO, por lo que se comparan como strings.
    const startIso = startDate.toISOString();
    const endIsoLimit = dayAfterEndDate.toISOString();

    //Consulta a Firestore: Filtra las facturas donde la fecha está entre [startDate, endDate]
    const q = query(
      facturasRef,
      where('fecha', '>=', startIso),
      where('fecha', '<', endIsoLimit)
    );

    //Convierte la Promise de getDocs(q) en un Observable usando 'from' y transforma el snapshot en un array de datos
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
  }

  getVentasPorDia(dias: number = 7): Observable<{ labels: string[], data: number[] }> {
    const endDate = new Date();
    //Calcula la fecha de inicio ajustada (hace 'dias' atrás)
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - dias);
    startDate.setHours(0, 0, 0, 0); // Desde el inicio del día

    return this.getFacturas(startDate, endDate).pipe(
        map(facturas => {
            const ventasPorDia = new Map<string, number>();
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

            //Contar las facturas por fecha
            facturas.forEach(factura => {
                //Convertimos el string ISO de vuelta a objeto Date
                const fechaFactura = new Date(factura.fecha);
                //Usa la fecha como clave para agrupar (ej: '25/09/2025')
                const fechaKey = fechaFactura.toLocaleDateString('es-ES', options as any);
                ventasPorDia.set(fechaKey, (ventasPorDia.get(fechaKey) || 0) + 1);
            });

            //Generar todas las fechas en el rango (para rellenar los días sin ventas con 0)
            const labels: string[] = [];
            const data: number[] = [];
            let currentDate = new Date(startDate);

            //Itera día por día hasta la fecha de hoy
            while (currentDate.getTime() <= new Date(endDate.toDateString()).getTime()) {
                const fechaKey = currentDate.toLocaleDateString('es-ES', options as any);
                labels.push(fechaKey);
                //Obtiene el conteo o 0 si no hubo ventas ese día
                data.push(ventasPorDia.get(fechaKey) || 0);

                //Avanza al siguiente día
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return { labels, data };
        })
    );
  }

   //Genera datos para el gráfico de Productos Más Vendidos.
  getProductosMasVendidos(limite: number = 5): Observable<{ labels: string[], data: number[] }> {
    const endDate = new Date();
    const startDate = new Date();
    //Rango: Último mes
    startDate.setMonth(endDate.getMonth() - 1);

    return this.getFacturas(startDate, endDate).pipe(
        map(facturas => {
            const conteoProductos = new Map<string, number>();

            //Iteración anidada: Recorre cada factura y luego los productos dentro de esa factura
            facturas.forEach(factura => {
                //Suma la cantidad vendida por nombre de producto
                factura.productos.forEach((item: any) => {
                    conteoProductos.set(item.nombre, (conteoProductos.get(item.nombre) || 0) + item.cantidad);
                });
            });

            //Filtrado y Ordenamiento:
            const topProductos = Array.from(conteoProductos.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, limite);

            //Estructura final para Chart.js
            return {
                labels: topProductos.map(p => p[0]),
                data: topProductos.map(p => p[1])
            };
        })
    );
  }
}
