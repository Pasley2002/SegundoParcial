import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteriaServicio } from '../service/reporteriaServicio';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { bcraServicio } from '../service/bcraServicio';

//Registra todos los componentes necesarios de Chart.js (escalas, elementos, etc.)
Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './reportes.html',
  styleUrls: ['./reportes.css']
})

export class Reportes implements OnInit {

  // Variables para la selección de período (control del usuario)
  periodoDiasVentas: number = 7;
  periodoProductosVendidos: number = 5;

  //Grafico 1: Ventas por Dias
  public ventasChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Día' } },
      y: { min: 0, title: { display: true, text: 'Cantidad de Ventas' }, ticks: { stepSize: 1 } }
    },
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Ventas por Día (últimos 7 días)' }
    }
  };

  public ventasChartType: ChartType = 'bar';
  public ventasChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], label: 'Ventas', backgroundColor: '#42A5F5', hoverBackgroundColor: '#64B5F6' }]
  };

  //Grafico 2: Productos mas vendidos
  public productosChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'right' },
      title: { display: true, text: 'Top 5 Productos Más Vendidos (Último Mes)' }
    }
  };
  public productosChartType: ChartType = 'doughnut';
  public productosChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], label: 'Unidades Vendidas' }]
  };

  //Grafico 3: Evolucion del Dolar
  public dolarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: true, text: 'Evolución Dólar' }
    }
  };
  public dolarChartType: ChartType = 'line';
  public dolarChartData: ChartData<'line'> = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        data: [350.50, 351.00, 349.80, 352.10, 352.50, 353.00, 352.90],
        label: 'Cotización ARS/USD',
        fill: 'origin',
        backgroundColor: 'rgba(255,159,64,0.2)',
        borderColor: 'rgb(255,159,64)'
      }
    ]
  };


  constructor(private reporteriaServicio: ReporteriaServicio, private router: Router, private bcraService: bcraServicio) { }

  ngOnInit(): void {
    //Carga inicial de todos los datos de los gráficos
    this.cargarVentasPorDia();
    this.cargarProductosMasVendidos();
    this.cargarEvolucionDolar();
  }

  cargarEvolucionDolar(): void {

    //Suscripción al servicio que obtiene el tipo de cambio actual (bcraServicio)
    this.bcraService.obtenerTipoCambio().subscribe(valorActual => {
        if (valorActual > 0) {
            //Base de la simulación: utiliza el valor real obtenido
            const base = valorActual;
            const evolucion: number[] = [];
            const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

            //Generar 7 puntos de datos simulados con pequeña variación alrededor de la base
            for (let i = 0; i < 7; i++) {
                const variacion = (Math.random() * 1.0) - 0.5;
                evolucion.push(parseFloat((base + variacion).toFixed(2)));
            }

            //Actualiza los datos del gráfico de línea (cotización dólar)
            this.dolarChartData = {
                labels: labels,
                datasets: [
                    {
                        ...this.dolarChartData.datasets[0],
                        data: evolucion,
                        label: `Cotización (Valor Actual: $${valorActual})`
                    }
                ]
            };

            //Actualiza el título para reflejar el uso de datos reales/simulados
            this.dolarChartOptions = {
                ...this.dolarChartOptions,
                plugins: {
                    ...this.dolarChartOptions?.plugins,
                    title: { display: true, text: 'Evolución Semanal Estimada del Dólar (ARS/USD)' }
                }
            };
        }
    });
  }

  cargarVentasPorDia(): void {
    //Actualiza el título para reflejar el período seleccionado por el usuario
    this.ventasChartOptions = {
        ...this.ventasChartOptions,
        plugins: {
            ...this.ventasChartOptions?.plugins,
            title: { display: true, text: `Ventas por Día (últimos ${this.periodoDiasVentas} días)` }
        }
    };

    //Llama al servicio de reportería para obtener los datos de ventas
    this.reporteriaServicio.getVentasPorDia(this.periodoDiasVentas).subscribe(data => {
      this.ventasChartData = {
        labels: data.labels,
        datasets: [{ ...this.ventasChartData.datasets[0], data: data.data }]
      };
    });
  }

  cargarProductosMasVendidos(): void {
    //Llama al servicio para obtener los datos del top X de productos
    this.reporteriaServicio.getProductosMasVendidos(this.periodoProductosVendidos).subscribe(data => {
      //Actualiza los datos del gráfico de Dona
      this.productosChartData = {
        labels: data.labels,
        datasets: [{ ...this.productosChartData.datasets[0], data: data.data }]
      };

      this.productosChartData.datasets[0].backgroundColor = this.generateColors(data.data.length);
    });
  }

  //Función auxiliar para generar colores cíclicos para el gráfico de Dona
  private generateColors(count: number): string[] {
    const baseColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }
}
