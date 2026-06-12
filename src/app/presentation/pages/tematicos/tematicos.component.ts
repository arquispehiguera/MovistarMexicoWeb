import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { GetTematicosUseCase, CreateTematicoUseCase, ToggleTematicoStatusUseCase } from '../../../domain/use-cases/tematicos.use-cases';
import { Tematico } from '../../../domain/entities/tematico.entity';
import { LucideAngularModule, ChevronDown, ChevronRight, Plus, Trash2, X, Search } from 'lucide-angular';
import { isInvalid } from '../../../shared/utils/form.utils';
import { ToastService } from '../../../core/services/toast.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { PermissionService } from '../../../core/services/permission.service';

interface ResultadoGroup {
  resultado: string;
  motivos: Tematico[];
  expanded: boolean;
  searchTerm: string;
}

@Component({
  selector: 'app-tematicos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ModalComponent
  ],
  templateUrl: './tematicos.component.html',
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `]
})
export class TematicosComponent implements OnInit {
  // Services
  public permissions = inject(PermissionService);

  // Icons
  readonly ChevronDown = ChevronDown;
  readonly ChevronRight = ChevronRight;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Search = Search;

  // State
  showModal = signal<boolean>(false);
  selectedResultado = signal<string | null>(null);
  isNewResultado = signal<boolean>(false);

  // Forms
  motivoForm!: FormGroup;

  // Computed
  resultadosGrouped = computed(() => {
    const tematicos = this.getTematicosUseCase.tematicos();
    const groups = new Map<string, Tematico[]>();

    // Group by resultado
    tematicos.forEach(tematico => {
      if (!groups.has(tematico.resultado)) {
        groups.set(tematico.resultado, []);
      }
      groups.get(tematico.resultado)!.push(tematico);
    });

    // Convert to array and sort
    return Array.from(groups.entries())
      .map(([resultado, motivos]) => ({
        resultado,
        motivos: motivos.sort((a, b) => a.motivo.localeCompare(b.motivo)),
        expanded: false
      }))
      .sort((a, b) => a.resultado.localeCompare(b.resultado));
  });

  expandedStates = signal<Map<string, boolean>>(new Map());
  searchTerms = signal<Map<string, string>>(new Map());

  constructor(
    private fb: FormBuilder,
    public getTematicosUseCase: GetTematicosUseCase,
    public createTematicoUseCase: CreateTematicoUseCase,
    public toggleStatusUseCase: ToggleTematicoStatusUseCase,
    private toast: ToastService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadTematicos();
  }

  private initForm(): void {
    this.motivoForm = this.fb.group({
      resultado: ['', Validators.required],
      motivo: ['', Validators.required],
      activo: [true]
    });
  }

  loadTematicos(): void {
    this.getTematicosUseCase.execute().subscribe({
      error: err => console.error('Error loading tematicos:', err)
    });
  }

  toggleResultado(resultado: string): void {
    const current = this.expandedStates();
    const isCurrentlyExpanded = current.get(resultado);
    const newMap = new Map<string, boolean>();

    // Si no está expandido, expandirlo y cerrar todos los demás
    // Si ya está expandido, cerrarlo
    if (!isCurrentlyExpanded) {
      newMap.set(resultado, true);
    }

    this.expandedStates.set(newMap);
  }

  isExpanded(resultado: string): boolean {
    return this.expandedStates().get(resultado) || false;
  }

  openModalForNewResultado(): void {
    this.isNewResultado.set(true);
    this.selectedResultado.set(null);
    this.motivoForm.reset({ activo: true });
    this.showModal.set(true);
  }

  openModalForExistingResultado(resultado: string): void {
    this.isNewResultado.set(false);
    this.selectedResultado.set(resultado);
    this.motivoForm.patchValue({ resultado, activo: true });
    this.motivoForm.get('resultado')?.disable();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.motivoForm.reset({ activo: true });
    this.motivoForm.get('resultado')?.enable();
    this.selectedResultado.set(null);
    this.isNewResultado.set(false);
  }

  async onSubmit(): Promise<void> {
    if (this.motivoForm.invalid) {
      this.motivoForm.markAllAsTouched();
      return;
    }

    try {
      const formValue = this.motivoForm.getRawValue();
      await firstValueFrom(this.createTematicoUseCase.execute({
        resultado: formValue.resultado.trim(),
        motivo: formValue.motivo.trim(),
        activo: formValue.activo
      }));

      const resultado = formValue.resultado.trim();
      const motivo = formValue.motivo.trim();

      this.closeModal();

      if (this.isNewResultado()) {
        this.toast.success('Éxito', `Se añadió el resultado ${resultado}`);
      } else {
        this.toast.success('Éxito', `Se añadió el motivo ${motivo} al resultado ${resultado}`);
      }
    } catch (error) {
      console.error('Error creating tematico:', error);
    }
  }

  toggleStatus(tematico: Tematico): void {
    this.toggleStatusUseCase.execute(tematico.tematicoID, !tematico.activo).subscribe({
      error: err => console.error('Error toggling status:', err)
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.motivoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getActiveCount(motivos: Tematico[]): number {
    return motivos.filter(m => m.activo).length;
  }

  getInactiveCount(motivos: Tematico[]): number {
    return motivos.filter(m => !m.activo).length;
  }

  invalid(name: string): boolean {
    return isInvalid(this.motivoForm.get(name));
  }

  getSearchTerm(resultado: string): string {
    return this.searchTerms().get(resultado) || '';
  }

  onSearchChange(resultado: string, searchTerm: string): void {
    const current = this.searchTerms();
    const newMap = new Map(current);
    newMap.set(resultado, searchTerm);
    this.searchTerms.set(newMap);
  }

  clearSearch(resultado: string): void {
    const current = this.searchTerms();
    const newMap = new Map(current);
    newMap.delete(resultado);
    this.searchTerms.set(newMap);
  }

  getFilteredMotivos(motivos: Tematico[], resultado: string): Tematico[] {
    const searchTerm = this.getSearchTerm(resultado).toLowerCase().trim();
    if (!searchTerm) {
      return motivos;
    }
    return motivos.filter(motivo =>
      motivo.motivo.toLowerCase().includes(searchTerm)
    );
  }
}
