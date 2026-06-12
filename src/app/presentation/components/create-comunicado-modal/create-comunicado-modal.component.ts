import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { APP_ICONS } from '../../../core/config/icons.config';
import { ModalComponent } from '../modal/modal.component';
import { ComunicadoRepository } from '../../../domain/repositories/comunicado.repository';
import { ToastService } from '../../../core/services/toast.service';
import { UsuarioRepository } from '../../../domain/repositories/usuario.repository';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { CreateComunicadoDto, ComunicadoDto } from '../../../domain/models/comunicado.model';

type TabType = 'nuevo' | 'historial';

@Component({
  selector: 'app-create-comunicado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ModalComponent],
  templateUrl: './create-comunicado-modal.component.html'
})
export class CreateComunicadoModalComponent {
  isOpen = input<boolean>(false);
  closeModal = output<void>();
  comunicadoCreated = output<void>();

  // Tabs
  activeTab: TabType = 'nuevo';

  // Form fields
  titulo = '';
  mensaje = '';
  enviarATodos = true;
  usuariosSeleccionados: number[] = [];

  // State
  loading = signal(false);
  loadingUsuarios = signal(false);
  loadingHistorial = signal(false);
  usuariosRol3: { usuarioID: number; nombreCompleto: string }[] = [];
  misComunicados: ComunicadoDto[] = [];

  // Icons
  readonly SendIcon = APP_ICONS.Send;
  readonly UsersIcon = APP_ICONS.Users;
  readonly Loader2Icon = APP_ICONS.Loader2;
  readonly MegaphoneIcon = APP_ICONS.Megaphone;
  readonly HistoryIcon = APP_ICONS.History;
  readonly PlusCircleIcon = APP_ICONS.PlusCircle;
  readonly EyeIcon = APP_ICONS.Eye;
  readonly EyeOffIcon = APP_ICONS.EyeOff;
  readonly BarChart3Icon = APP_ICONS.BarChart3;

  // Validación
  get isValid(): boolean {
    return this.titulo.trim().length > 0 &&
           this.mensaje.trim().length > 0 &&
           (this.enviarATodos || this.usuariosSeleccionados.length > 0);
  }

  constructor(
    private comunicadoRepo: ComunicadoRepository,
    private toast: ToastService,
    private usuarioRepo: UsuarioRepository,
    private authRepo: AuthRepository
  ) {
    // Cargar datos cuando se abre el modal
    effect(() => {
      if (this.isOpen()) {
        this.cargarUsuariosRol3();
        this.cargarMisComunicados();
      }
    });
  }

  setTab(tab: TabType): void {
    this.activeTab = tab;
  }

  async cargarUsuariosRol3(): Promise<void> {
    this.loadingUsuarios.set(true);
    try {
      await this.usuarioRepo.getUsuarios();
      const usuarios = this.usuarioRepo.usuarios();
      this.usuariosRol3 = usuarios
        .filter(u => u.rolID === 3 && u.activo)
        .map(u => ({
          usuarioID: u.usuarioID,
          nombreCompleto: `${u.nombres} ${u.apellidoPaterno}`.trim()
        }));
    } finally {
      this.loadingUsuarios.set(false);
    }
  }

  cargarMisComunicados(): void {
    this.loadingHistorial.set(true);
    const currentUserId = this.authRepo.user()?.usuarioID;

    this.comunicadoRepo.getAll().subscribe({
      next: (data) => {
        // Filtrar solo mis comunicados, ordenar por fecha y tomar los últimos 10
        this.misComunicados = data
          .filter(c => c.usuarioEmisorID === currentUserId)
          .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
          .slice(0, 10);
        this.loadingHistorial.set(false);
      },
      error: () => {
        this.loadingHistorial.set(false);
      }
    });
  }

  toggleUsuario(usuarioID: number): void {
    const index = this.usuariosSeleccionados.indexOf(usuarioID);
    if (index > -1) {
      this.usuariosSeleccionados.splice(index, 1);
    } else {
      this.usuariosSeleccionados.push(usuarioID);
    }
  }

  isUsuarioSeleccionado(usuarioID: number): boolean {
    return this.usuariosSeleccionados.includes(usuarioID);
  }

  seleccionarTodos(): void {
    this.usuariosSeleccionados = this.usuariosRol3.map(u => u.usuarioID);
  }

  deseleccionarTodos(): void {
    this.usuariosSeleccionados = [];
  }

  enviar(): void {
    if (!this.isValid) return;

    this.loading.set(true);

    const dto: CreateComunicadoDto = {
      titulo: this.titulo.trim(),
      mensaje: this.mensaje.trim(),
      usuariosDestinatarios: this.enviarATodos ? undefined : this.usuariosSeleccionados
    };

    this.comunicadoRepo.create(dto).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.toast.success('Comunicado enviado', `Se enviaron ${response.notificacionesEnviadas} notificaciones`);
        this.resetForm();
        this.cargarMisComunicados(); // Recargar historial
        this.comunicadoCreated.emit();
        this.closeModal.emit();
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Error', 'No se pudo enviar el comunicado');
      }
    });
  }

  resetForm(): void {
    this.titulo = '';
    this.mensaje = '';
    this.enviarATodos = true;
    this.usuariosSeleccionados = [];
  }

  onClose(): void {
    this.resetForm();
    this.activeTab = 'nuevo';
    this.closeModal.emit();
  }

  // Helpers para estadísticas
  getPorcentajeLeidos(comunicado: ComunicadoDto): number {
    if (!comunicado.totalEnviados || comunicado.totalEnviados === 0) return 0;
    return Math.round(((comunicado.totalLeidos || 0) / comunicado.totalEnviados) * 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
