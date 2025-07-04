import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../class/Producto/producto';

@Pipe({
  name: 'filtro'
})

export class FiltroPipe implements PipeTransform {

  transform(productos: Producto[], texto: string): Producto[] {
    if (!productos || !texto) return productos;
    texto = texto.toLowerCase();

    return productos.filter(producto =>
      producto.nombre.toLowerCase().includes(texto) ||
      producto.categoria.toLowerCase().includes(texto)
    );
  }

}