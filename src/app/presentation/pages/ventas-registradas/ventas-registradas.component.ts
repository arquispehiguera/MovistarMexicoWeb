import { Component, OnInit, signal, computed, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { LucideAngularModule } from 'lucide-angular';
import { APP_ICONS } from '../../../core/config/icons.config';
import { RegistroVentaRepository } from '../../../domain/repositories/registro-venta.repository';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { QueryParameters } from '../../../domain/models/query-parameters.model';
import { RegistroVenta } from '../../../domain/entities/registro-venta.entity';
import { DireccionEntrega } from '../../../domain/entities/direccion-entrega.entity';
import { DireccionFacturacion } from '../../../domain/entities/direccion-facturacion.entity';
import { SpinnerComponent } from '../../components/spinner/spinner';
import { ModalComponent } from '../../components/modal/modal.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UsuarioRepository } from '../../../domain/repositories/usuario.repository';
import { Usuario } from '../../../domain/entities/usuario.entity';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-ventas-registradas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    NgSelectModule,
    LucideAngularModule,
    SpinnerComponent,
    ModalComponent
  ],
  templateUrl: './ventas-registradas.component.html'
})
export class VentasRegistradasComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  // Columnas esenciales para la tabla principal
  displayedColumns: string[] = [
    'ventaID',
    'producto',
    'cliente',
    'numeroPortar',
    'tipoLinea',
    'plan',
    'fechaRegistro',
    'acciones'
  ];

  dataSource = new MatTableDataSource<RegistroVenta>([]);

  // Signals
  isLoading = signal<boolean>(false);
  totalCount = signal<number>(0);
  searchTerm = signal<string>('');
  selectedVenta = signal<RegistroVenta | null>(null);
  showDetailModal = signal<boolean>(false);
  usuarioVenta = signal<Usuario | null>(null);
  direccionEntrega = signal<DireccionEntrega | null>(null);
  direccionFacturacion = signal<DireccionFacturacion | null>(null);

  queryParams = signal<QueryParameters>({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: undefined,
    sortBy: 'fechaRegistro',
    sortDirection: 'DESC'
  });

  // Icons
  readonly SearchIcon = APP_ICONS.Search;
  readonly XIcon = APP_ICONS.X;
  readonly Database = APP_ICONS.Database;
  readonly ChevronLeftIcon = APP_ICONS.ChevronLeft;
  readonly ChevronRightIcon = APP_ICONS.ChevronRight;
  readonly View = APP_ICONS.View;
  readonly Trash2Icon = APP_ICONS.Trash2;
  // Pagination
  readonly Math = Math;

  showDeleteModal = signal<boolean>(false);
  ventaToDelete = signal<RegistroVenta | null>(null);
  isDeleting = signal<boolean>(false);

  canDelete = computed(() => {
    const user = this.authRepo.user();
    return (user?.grantDelete ?? 0) === 1;
  });
  pageSizeOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 }
  ];

  totalPages = computed(() => Math.ceil(this.totalCount() / this.queryParams().pageSize));

  // Search subject para debounce
  private searchSubject = new Subject<string>();

  constructor(
    private repository: RegistroVentaRepository,
    private authRepo: AuthRepository,
    private usuarioRepo: UsuarioRepository,
    private toast: ToastService
  ) {
    // Configurar debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.queryParams.update(p => ({
        ...p,
        pageNumber: 1,
        searchTerm: searchValue || undefined
      }));
      this.loadVentas();
    });
  }

  ngOnInit(): void {
    this.loadVentas();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadVentas(): void {
    this.isLoading.set(true);
    const params = this.queryParams();
    const user = this.authRepo.user();

    // Si no hay usuario, no cargar nada
    if (!user) {
      this.isLoading.set(false);
      return;
    }

    const observable = (user.rolID === 1 || user.rolID === 2 || user.rolID === 4)
      ? this.repository.getRegistrosVentaPaged(params)
      : this.repository.getMisVentasPaged(params);

    observable.subscribe({
      next: (result) => {
        this.dataSource.data = result.data;
        this.totalCount.set(result.totalCount);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading ventas:', err);
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(value: string): void {
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.searchSubject.next('');
  }

  changePageSize(newSize: number): void {
    this.queryParams.update(p => ({
      ...p,
      pageNumber: 1,
      pageSize: newSize
    }));
    this.loadVentas();
  }

  nextPage(): void {
    const current = this.queryParams();
    if (current.pageNumber < this.totalPages()) {
      this.queryParams.update(p => ({ ...p, pageNumber: p.pageNumber + 1 }));
      this.loadVentas();
    }
  }

  previousPage(): void {
    const current = this.queryParams();
    if (current.pageNumber > 1) {
      this.queryParams.update(p => ({ ...p, pageNumber: p.pageNumber - 1 }));
      this.loadVentas();
    }
  }

  goToPage(page: number): void {
    this.queryParams.update(p => ({ ...p, pageNumber: page }));
    this.loadVentas();
  }

  // Generar páginas con elipsis
  getPageNumbers(): (number | string)[] {
    const total = this.totalPages();
    const current = this.queryParams().pageNumber;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      // Si hay 7 o menos páginas, mostrar todas
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar primera página
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      // Páginas alrededor de la actual
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push('...');
      }

      // Siempre mostrar última página
      pages.push(total);
    }

    return pages;
  }

formatDate(date: string | Date | null): string {
  if (!date) return '-';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

formatDateTime(date: string | Date | null): string {
  if (!date) return '-';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
 parsePeruDate(date: string | Date): Date {
  // Si es Date, devolverlo directamente
  if (date instanceof Date) return date;

  // Parsear como UTC y luego ajustar a Lima
  const d = new Date(date + 'Z'); // aseguramos que JS lo interprete como UTC
  const offset = -5 * 60; // Perú UTC-5 en minutos
  return new Date(d.getTime() + offset * 60 * 1000);
}

formatTiempoGestion(inicio: Date | string | null, fin: Date | string | null): string {
  if (!inicio || !fin) return '-';

  const start = this.parsePeruDate(inicio).getTime();
  const end = this.parsePeruDate(fin).getTime();

  const diffMs = end - start;
  if (diffMs < 0) return '-';

  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


  getProductoBadgeClass(producto: string): string {
    const classes: Record<string, string> = {
      'portabilidad': 'bg-blue-100 text-blue-800 border border-blue-300',
      'recambio': 'bg-green-100 text-green-800 border border-green-300',
      'capta-fija': 'bg-purple-100 text-purple-800 border border-purple-300',
      'capta fija': 'bg-purple-100 text-purple-800 border border-purple-300',
      'baf': 'bg-orange-100 text-orange-800 border border-orange-300'
    };
    return classes[producto?.toLowerCase()] || 'bg-gray-100 text-gray-800 border border-gray-300';
  }



getUserRegisterVenta(usuarioID: number): void {
  this.usuarioRepo.getUsuarioById(usuarioID).subscribe({
    next: usuario => this.usuarioVenta.set(usuario),
    error: err => console.error('Error obteniendo usuario:', err)
  });
}


  // Abrir modal de detalles
  openDetailModal(venta: RegistroVenta): void {
    this.selectedVenta.set(venta);
    this.direccionEntrega.set(null);
    this.direccionFacturacion.set(null);
    this.usuarioVenta.set(null);
    this.showDetailModal.set(true);

    this.repository.getVentaCompleta(venta.ventaID).subscribe({
      next: result => {
        this.selectedVenta.set(result.venta);
        this.direccionEntrega.set(result.direccionEntrega);
        this.direccionFacturacion.set(result.direccionFacturacion);
        this.getUserRegisterVenta(result.venta.usuarioID);
      },
      error: err => console.error('Error loading venta detail:', err)
    });
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedVenta.set(null);
    this.direccionEntrega.set(null);
    this.direccionFacturacion.set(null);
  }

  openDeleteModal(venta: RegistroVenta): void {
    this.ventaToDelete.set(venta);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.ventaToDelete.set(null);
  }

  confirmDelete(): void {
    const venta = this.ventaToDelete();
    if (!venta) return;

    this.isDeleting.set(true);
    this.repository.deleteRegistroVenta(venta.ventaID).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeleteModal.set(false);
        this.ventaToDelete.set(null);
        this.toast.success('Venta eliminada', `La venta #${venta.ventaID} fue eliminada correctamente`);
        this.loadVentas();
      },
      error: (err) => {
        console.error('Error eliminando venta:', err);
        this.isDeleting.set(false);
      }
    });
  }
}
