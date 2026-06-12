import { Injectable } from '@angular/core';
import type { EChartsOption } from 'echarts';
import { DashboardStats, VentasPorCategoria } from '../../../domain/models/dashboard-stats.model';

@Injectable({ providedIn: 'root' })
export class DashboardChartsConfigService {

  buildResultadosDonut(data: DashboardStats): EChartsOption {
    return {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { orient: 'horizontal', bottom: 0, textStyle: { fontSize: 12, color: '#64748b' } },
      series: [{
        type: 'pie',
        radius: ['48%', '68%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: false,
        data: data.distribucionResultados.map(r => ({
          name: r.resultado,
          value: r.cantidad,
          itemStyle: { color: r.color }
        })),
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
        label: { show: true, formatter: '{d}%', fontSize: 12, fontWeight: 'bold' as const }
      }]
    };
  }

  buildAreaChart(data: DashboardStats): EChartsOption {
    return {
      tooltip: { trigger: 'axis', formatter: (p: any) => `${p[0].name}: ${p[0].value} ventas` },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.ventasPorPeriodo.map(v => v.fecha),
        axisLabel: { color: '#64748b', fontSize: 11 }
      },
      yAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 11 } },
      series: [{
        type: 'line',
        data: data.ventasPorPeriodo.map(v => v.cantidad),
        smooth: true,
        lineStyle: { width: 3, color: '#10B981' },
        itemStyle: { color: '#10B981' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16,185,129,0.45)' },
              { offset: 1, color: 'rgba(16,185,129,0.04)' }
            ]
          } as any
        }
      }]
    };
  }

  buildTendencia(data: DashboardStats): EChartsOption {
    return {
      tooltip: { trigger: 'axis', formatter: (p: any) => `${p[0].name}: ${p[0].value}%` },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.tendenciaConversion.map(t => t.fecha),
        axisLabel: { color: '#64748b', fontSize: 11 }
      },
      yAxis: {
        type: 'value', min: 0, max: 100,
        axisLabel: { color: '#64748b', fontSize: 11, formatter: '{value}%' }
      },
      series: [{
        type: 'line',
        data: data.tendenciaConversion.map(t => t.tasaConversion),
        smooth: true,
        lineStyle: { width: 3, color: '#8B5CF6' },
        itemStyle: { color: '#8B5CF6' },
        symbol: 'circle',
        symbolSize: 8,
        label: { show: true, formatter: '{c}%', fontSize: 11 }
      }]
    };
  }

  buildPortabilidadCompania(data: DashboardStats): EChartsOption {
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['Intentos', 'Efectivos'], top: 0, textStyle: { color: '#64748b', fontSize: 12 } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.portabilidadPorCompania.map(p => p.compania),
        axisLabel: { color: '#64748b', fontSize: 11 }
      },
      yAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 11 } },
      series: [
        {
          name: 'Intentos',
          type: 'bar',
          data: data.portabilidadPorCompania.map(p => p.intentos),
          itemStyle: { color: '#94A3B8', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 40
        },
        {
          name: 'Efectivos',
          type: 'bar',
          data: data.portabilidadPorCompania.map(p => p.efectivos),
          itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 40
        }
      ]
    };
  }

  buildBarChart(data: DashboardStats): EChartsOption {
    const colors = ['#019DF4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.topEjecutivos.map(e => e.nombre.split(' ')[0]),
        axisLabel: { color: '#64748b', fontSize: 11 }
      },
      yAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 11 } },
      series: [{
        type: 'bar',
        data: data.topEjecutivos.map((e, idx) => ({
          value: e.ventas,
          itemStyle: { color: colors[idx % colors.length], borderRadius: [6, 6, 0, 0] }
        })),
        barMaxWidth: 50,
        label: { show: true, position: 'top', color: '#374151', fontSize: 12, fontWeight: 'bold' as const }
      }]
    };
  }

  buildCategoriaBar(
    items: VentasPorCategoria[],
    key: 'tipoLinea' | 'plan' | 'metodoEntrega' | 'cicloFacturacion'
  ): EChartsOption {
    const colorSets: Record<string, string[]> = {
      tipoLinea:        ['#019DF4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'],
      plan:             ['#3B82F6', '#06B6D4', '#6366F1', '#EC4899', '#14B8A6', '#F97316'],
      metodoEntrega:    ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6', '#06B6D4'],
      cicloFacturacion: ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#06B6D4']
    };
    const colors = colorSets[key];

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: items.map(i => i.nombre),
        axisLabel: { color: '#64748b', fontSize: 11, overflow: 'truncate', width: 80 }
      },
      yAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 11 } },
      series: [{
        type: 'bar',
        data: items.map((i, idx) => ({
          value: i.cantidad,
          itemStyle: { color: colors[idx % colors.length], borderRadius: [8, 8, 0, 0] }
        })),
        barMaxWidth: 55,
        label: { show: true, position: 'top', color: '#374151', fontSize: 12, fontWeight: 'bold' as const }
      }]
    };
  }
}
