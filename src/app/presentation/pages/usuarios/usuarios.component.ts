import { Component, OnInit, signal, computed, inject, ViewChild, AfterViewInit } from '@angular/core';
import { Role } from '../../../domain/enums/role.enum';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { NgSelectModule } from '@ng-select/ng-select';
import { LucideAngularModule } from 'lucide-angular';
import { APP_ICONS } from '../../../core/config/icons.config';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { firstValueFrom, Subject } from 'rxjs';
import { GetUsuariosPagedUseCase, CreateUsuarioUseCase, UpdateUsuarioUseCase } from '../../../domain/use-cases/usuario.use-cases';
import { GetPerfilesUseCase } from '../../../domain/use-cases/perfil.use-cases';
import { GetUserDataUseCase } from '../../../domain/use-cases/auth.use-cases';
import { QueryParameters } from '../../../domain/models/query-parameters.model';
import { SpinnerComponent } from '../../components/spinner/spinner';
import { ModalComponent } from '../../components/modal/modal.component';
import { PerfilRepository } from '../../../domain/repositories/perfil.repository';
import { ToastService } from '../../../core/services/toast.service';
import { PermissionService } from '../../../core/services/permission.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    NgSelectModule,
    LucideAngularModule,
    SpinnerComponent,
    ModalComponent,

  ],
  templateUrl: './usuarios.component.html'
})
export class Usuarios implements OnInit, AfterViewInit {
  // Services
  public permissions = inject(PermissionService);

  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [
    'nombreCompleto',
    'correo',
    'idRol',
    'isLogged',
    'lastConnection',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>([]);

  // Signals
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  totalCount = signal<number>(0);
  searchTerm = signal<string>('');
  isModalOpen = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  isSearchingLDAP = signal<boolean>(false);
  ldapSearchTerm = signal<string>('');

  queryParams = signal<QueryParameters>({
    pageNumber: 1,
    pageSize: 10,
    searchTerm: undefined,
    sortBy: undefined,
    sortDirection: undefined
  });

  // Form
  usuarioForm!: FormGroup;
  selectedUsuarioId: number | null = null;

  // Lucide Icons desde configuración centralizada
  readonly SearchIcon = APP_ICONS.Search;
  readonly PlusIcon = APP_ICONS.Plus;
  readonly EditIcon = APP_ICONS.Edit;
  readonly DownloadIcon = APP_ICONS.Download;
  readonly FileTextIcon = APP_ICONS.FileText;
  readonly ChevronLeftIcon = APP_ICONS.ChevronLeft;
  readonly ChevronRightIcon = APP_ICONS.ChevronRight;
  readonly UserPen = APP_ICONS.UserPen;
  readonly XIcon = APP_ICONS.X;
  readonly ShieldCheckIcon = APP_ICONS.ShieldCheck;
  readonly UserIcon = APP_ICONS.User;
  readonly Users = APP_ICONS.Users;
  readonly EyeIcon = APP_ICONS.Eye;

  // Computed para paginación
  totalPages = computed(() => Math.ceil(this.totalCount() / this.queryParams().pageSize));

  // Opciones para el selector de tamaño de página
  pageSizeOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 }
  ];

  // Math para el template
  Math = Math;

  private searchSubject = new Subject<string>();
  private fb = inject(FormBuilder);

  constructor(
    private getUsuariosPagedUseCase: GetUsuariosPagedUseCase,
    private createUsuarioUseCase: CreateUsuarioUseCase,
    private updateUsuarioUseCase: UpdateUsuarioUseCase,
    private getPerfilesUseCase: GetPerfilesUseCase,
    private getUserDataUseCase: GetUserDataUseCase,
    public perfilRepo: PerfilRepository,
    private toast: ToastService
  ) {
    this.initForm();

    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.searchTerm.set(searchValue);
      this.updateQueryParams({ searchTerm: searchValue || undefined, pageNumber: 1 });
      this.loadUsuarios();
    });
  }

  ngOnInit(): void {
    this.loadUsuarios();
    this.loadPerfiles();
  }

  ngAfterViewInit(): void {
    // Conectar el MatSort al dataSource no es necesario en este caso
    // porque estamos usando server-side sorting
    if (this.sort) {
      this.sort.sortChange.subscribe((sortState: Sort) => {
        this.onSortChange(sortState);
      });
    }
  }

  onSortChange(sortState: Sort): void {
    // Mapear los nombres de las columnas a los nombres del backend
    const columnMapping: { [key: string]: string } = {
      'nombreCompleto': 'nombres',
      'correo': 'email',
      'idRol': 'rolID',
      'lastConnection': 'ultimaConexion',
      'estado': 'activo'
    };

    const sortBy = sortState.active ? columnMapping[sortState.active] || sortState.active : undefined;
    const sortDirection = sortState.direction ? sortState.direction.toUpperCase() as 'ASC' | 'DESC' : undefined;

    this.updateQueryParams({
      sortBy,
      sortDirection,
      pageNumber: 1 // Reset to first page when sorting
    });
    this.loadUsuarios();
  }

  private loadPerfiles(): void {
    this.getPerfilesUseCase.execute().subscribe();
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      correo: ['', [Validators.email]],
      username: ['', Validators.required],
      rolID: [null, Validators.required],
      activo: [true]
    });
  }


  private updateQueryParams(updates: Partial<QueryParameters>): void {
    this.queryParams.update(current => ({ ...current, ...updates }));
  }

  loadUsuarios(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const params = this.queryParams();

    this.getUsuariosPagedUseCase.execute(params).subscribe({
      next: (result) => {
        // Transformar los datos para que coincidan con el HTML
        let transformedData = result.data.map((usuario: any) => ({
          idUsuario: usuario.usuarioID || usuario.idUsuario,
          nombreCompleto: `${usuario.nombres || ''} ${usuario.apellidoPaterno || ''} ${usuario.apellidoMaterno || ''}`.trim(),
          correo: usuario.email || usuario.correo,
          username: usuario.nombreUsuario || usuario.username,
          idRol: usuario.rolID || usuario.idRol || 2,
          isLogged: usuario.isLogged || false,
          lastConnection: usuario.lastConnection || null,
          estado: usuario.activo !== undefined ? usuario.activo : usuario.estado
        }));

        this.dataSource.data = transformedData;
        this.totalCount.set(result.totalCount);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error.set('Error al cargar los usuarios');
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(value: string): void {
    this.searchSubject.next(value);
  }

  // Métodos de navegación de páginas personalizados
  previousPage(): void {
    const currentPage = this.queryParams().pageNumber;
    if (currentPage > 1) {
      this.updateQueryParams({ pageNumber: currentPage - 1 });
      this.loadUsuarios();
    }
  }

  nextPage(): void {
    const currentPage = this.queryParams().pageNumber;
    if (currentPage < this.totalPages()) {
      this.updateQueryParams({ pageNumber: currentPage + 1 });
      this.loadUsuarios();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.updateQueryParams({ pageNumber: page });
      this.loadUsuarios();
    }
  }

  changePageSize(newPageSize: number): void {
    this.updateQueryParams({
      pageNumber: 1,
      pageSize: newPageSize
    });
    this.loadUsuarios();
  }

  // Limpiar búsqueda
  clearSearch(): void {
    this.searchTerm.set('');
    this.updateQueryParams({ searchTerm: undefined, pageNumber: 1 });
    this.loadUsuarios();
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

  // Obtener nombre de rol con icono y color
  getRolInfo(rolID: number): { label: string; icon: any; colorClass: string } {
    switch (rolID) {
      case Role.Admin:
        return {
          label: 'Administrador',
          icon: this.ShieldCheckIcon,
          colorClass: 'bg-red-100 text-red-800 border-red-300'
        };
      case Role.Manager:
        return {
          label: 'Supervisor',
          icon: this.ShieldCheckIcon,
          colorClass: 'bg-blue-100 text-blue-800 border-blue-300'
        };
      case Role.Ejecutivo:
        return {
          label: 'Gestor/Ejecutivo',
          icon: this.UserIcon,
          colorClass: 'bg-green-100 text-green-800 border-green-300'
        };
      case Role.Supervisor:
        return {
          label: 'Coordinador',
          icon: this.EyeIcon,
          colorClass: 'bg-purple-100 text-purple-800 border-purple-300'
        };
      default:
        return {
          label: 'Sin rol',
          icon: this.UserIcon,
          colorClass: 'bg-gray-100 text-gray-800 border-gray-300'
        };
    }
  }

  openModal(): void {
    this.isEditMode.set(false);
    this.selectedUsuarioId = null;
    this.ldapSearchTerm.set('');
    this.usuarioForm.reset({
      activo: true
    });
    this.isModalOpen.set(true);
  }

  async searchUserInLDAP(): Promise<void> {
    this.usuarioForm.reset({
      activo: true
    });
    const username = this.ldapSearchTerm().trim();

    if (!username) {
      this.toast.warning('Advertencia', 'Por favor ingrese un nombre de usuario');
      return;
    }

    this.isSearchingLDAP.set(true);

    try {
      const usuario = await firstValueFrom(this.getUserDataUseCase.execute(username));

      this.usuarioForm.patchValue({
        nombres: usuario.nombres,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno || '',
        correo: usuario.email,
        username: usuario.nombreUsuario
      });

      this.toast.success('Usuario encontrado', `Se encontró el usuario ${usuario.nombres} ${usuario.apellidoPaterno} en LDAP`);
    } catch {
      this.toast.error('No encontrado', `No se encontró el usuario "${username}" en el directorio activo`);
    } finally {
      this.isSearchingLDAP.set(false);
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.usuarioForm.reset();
    this.selectedUsuarioId = null;
    this.ldapSearchTerm.set('');
  }

  editUsuario(usuario: any): void {
    this.isEditMode.set(true);
    this.selectedUsuarioId = usuario.idUsuario;

    // Cargar los datos del usuario en el formulario
    const nombreParts = usuario.nombreCompleto?.split(' ') || [];
    const nombres = nombreParts[0] || '';
    const apellidoPaterno = nombreParts[1] || '';
    const apellidoMaterno = nombreParts.slice(2).join(' ') || '';

    this.usuarioForm.patchValue({
      nombres: nombres,
      apellidoPaterno: apellidoPaterno,
      apellidoMaterno: apellidoMaterno,
      correo: usuario.correo,
      username: usuario.username,
      rolID: usuario.idRol,
      activo: usuario.estado
    });

    this.isModalOpen.set(true);
  }

  async onSubmitForm(): Promise<void> {
    if (this.usuarioForm.valid) {
      this.isLoading.set(true);

      try {
        const formData = this.usuarioForm.value;

        if (this.isEditMode() && this.selectedUsuarioId) {
          // Actualizar usuario
          const updateData = {
            usuarioID: this.selectedUsuarioId,
            rolID: formData.rolID,
            nombreUsuario: formData.username,
            nombres: formData.nombres,
            apellidoPaterno: formData.apellidoPaterno,
            apellidoMaterno: formData.apellidoMaterno || null,
            email: formData.correo,
            activo: formData.activo
          };

          await firstValueFrom(this.updateUsuarioUseCase.execute(this.selectedUsuarioId, updateData));

          this.toast.success('Excelente!', `Se actualizó el usuario ${formData.nombres} correctamente.`);
          this.closeModal();
          this.loadUsuarios();

        } else {
          // Crear nuevo usuario
          const createData = {
            rolID: formData.rolID,
            nombreUsuario: formData.username,
            nombres: formData.nombres,
            apellidoPaterno: formData.apellidoPaterno,
            apellidoMaterno: formData.apellidoMaterno || null,
            email: formData.correo,
            activo: formData.activo
          };

          await firstValueFrom(this.createUsuarioUseCase.execute(createData));
          this.toast.success('Excelente!', `Se creó el usuario ${formData.nombres} correctamente.`);
        }

        this.closeModal();
        this.loadUsuarios();
      } catch (error) {
        console.error('Error al guardar usuario:', error);
        this.error.set('Error al guardar el usuario');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
    }
  }



  onEstadoChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.usuarioForm.patchValue({ activo: checkbox.checked });
  }


  invalid(fieldName: string): boolean {
    const field = this.usuarioForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return 'Nunca';

    try {
      const d = new Date(date);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours}h`;
      if (diffDays < 7) return `Hace ${diffDays}d`;

      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  }

  async exportToCSV(): Promise<void> {
    const totalRegistros = this.totalCount();

    if (totalRegistros === 0) {
      this.toast.warning('Advertencia', 'No hay datos para exportar');
      return;
    }

    const allUsersParams: QueryParameters = {
      pageNumber: 1,
      pageSize: totalRegistros,
      searchTerm: this.searchTerm() || undefined,
      sortBy: this.queryParams().sortBy,
      sortDirection: this.queryParams().sortDirection
    };

    const result = await firstValueFrom(this.getUsuariosPagedUseCase.execute(allUsersParams));

    if (!result) {
      this.toast.error('Error', 'No se pudo obtener los datos');
      return;
    }

    const headers = [
      'ID',
      'Nombre Completo',
      'Correo',
      'Usuario',
      'Perfil',
      'Estado'
    ];

    const rows = result.data.map((usuario: any) => {
      // Transformar los datos igual que en loadUsuarios
      const transformed = {
        idUsuario: usuario.usuarioID || usuario.idUsuario,
        nombreCompleto: `${usuario.nombres || ''} ${usuario.apellidoPaterno || ''} ${usuario.apellidoMaterno || ''}`.trim(),
        correo: usuario.email || usuario.correo,
        username: usuario.nombreUsuario || usuario.username,
        idRol: usuario.rolID || usuario.idRol || 2,
        estado: usuario.activo !== undefined ? usuario.activo : usuario.estado
      };

      return [
        transformed.idUsuario,
        transformed.nombreCompleto,
        transformed.correo,
        transformed.username,
        transformed.idRol === 1 ? 'Administrador' : 'Usuario',
        transformed.estado ? 'Activo' : 'Inactivo'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `usuarios_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toast.success('Éxito', `Archivo CSV exportado con ${rows.length} registros`);
  }

  async exportToPDF(): Promise<void> {
    const totalRegistros = this.totalCount();

    if (totalRegistros === 0) {
      this.toast.warning('Advertencia', 'No hay datos para exportar');
      return;
    }

    const allUsersParams: QueryParameters = {
      pageNumber: 1,
      pageSize: totalRegistros,
      searchTerm: this.searchTerm() || undefined,
      sortBy: this.queryParams().sortBy,
      sortDirection: this.queryParams().sortDirection
    };

    const result = await firstValueFrom(this.getUsuariosPagedUseCase.execute(allUsersParams));

    if (!result) {
      this.toast.error('Error', 'No se pudo obtener los datos');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.text('Lista de Usuarios', pageWidth / 2, 22, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = result.data.map((usuario: any) => {
      // Transformar los datos igual que en loadUsuarios
      const transformed = {
        idUsuario: usuario.usuarioID || usuario.idUsuario,
        nombreCompleto: `${usuario.nombres || ''} ${usuario.apellidoPaterno || ''} ${usuario.apellidoMaterno || ''}`.trim(),
        correo: usuario.email || usuario.correo,
        username: usuario.nombreUsuario || usuario.username,
        idRol: usuario.rolID || usuario.idRol || 2,
        estado: usuario.activo !== undefined ? usuario.activo : usuario.estado
      };

      return [
        transformed.idUsuario,
        transformed.nombreCompleto,
        transformed.correo,
        transformed.username,
        transformed.idRol === 1 ? 'Administrador' : 'Usuario',
        transformed.estado ? 'Activo' : 'Inactivo'
      ];
    });

    autoTable(doc, {
      head: [[
        'ID',
        'Nombre',
        'Correo',
        'Usuario',
        'Perfil',
        'Estado'
      ]],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 89, 185],
        textColor: 255
      }
    });

    doc.save(`usuarios_${Date.now()}.pdf`);

    this.toast.success('Éxito', `Archivo PDF exportado con ${tableData.length} registros`);
  }
}
