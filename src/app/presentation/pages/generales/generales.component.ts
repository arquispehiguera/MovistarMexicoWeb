import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { forkJoin, firstValueFrom } from 'rxjs';
import { LucideAngularModule, Plus, X, Search } from 'lucide-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent } from '../../components/modal/modal.component';
import { PermissionService } from '../../../core/services/permission.service';

import { GetTiposLineaUseCase, CreateTipoLineaUseCase, UpdateTipoLineaUseCase } from '../../../domain/use-cases/tipo-linea.use-cases';
import { TipoLinea } from '../../../domain/entities/tipo-linea.entity';

import { GetMetodosEntregaUseCase, CreateMetodoEntregaUseCase, UpdateMetodoEntregaUseCase } from '../../../domain/use-cases/metodo-entrega.use-cases';
import { MetodoEntrega } from '../../../domain/entities/metodo-entrega.entity';

import { GetCiclosFacturacionUseCase, CreateCicloFacturacionUseCase, UpdateCicloFacturacionUseCase } from '../../../domain/use-cases/ciclo-facturacion.use-cases';
import { CicloFacturacion } from '../../../domain/entities/ciclo-facturacion.entity';

import { GetPlanesUseCase, CreatePlanUseCase, UpdatePlanUseCase } from '../../../domain/use-cases/plan.use-cases';
import { Plan } from '../../../domain/entities/plan.entity';

import { GetPlanesOriginalesUseCase, CreatePlanOriginalUseCase, UpdatePlanOriginalUseCase } from '../../../domain/use-cases/plan-original.use-cases';
import { PlanOriginal } from '../../../domain/entities/plan-original.entity';

import { GetPlanesDsctoUseCase, CreatePlanDsctoUseCase, UpdatePlanDsctoUseCase } from '../../../domain/use-cases/plan-dscto.use-cases';
import { PlanDscto } from '../../../domain/entities/plan-dscto.entity';

import { GetEstadosMexicoUseCase, CreateEstadoMexicoUseCase, UpdateEstadoMexicoUseCase } from '../../../domain/use-cases/estado-mexico.use-cases';
import { EstadoMexico } from '../../../domain/entities/estado-mexico.entity';

type TabType = 'tipos-linea' | 'metodos-entrega' | 'ciclos-facturacion' | 'planes' | 'planes-original' | 'planes-dscto' | 'estados-mexico';

@Component({
  selector: 'app-generales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule,
    NgSelectModule,
    ModalComponent
  ],
  templateUrl: './generales.component.html',
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class GeneralesComponent implements OnInit {
  public permissions = inject(PermissionService);

  readonly Plus = Plus;
  readonly X = X;
  readonly Search = Search;

  activeTab = signal<TabType>('tipos-linea');
  showModal = signal<boolean>(false);
  searchTerm = signal<string>('');

  tabOptions: { value: TabType; label: string }[] = [
    { value: 'tipos-linea',        label: 'Tipos de Línea' },
    { value: 'metodos-entrega',    label: 'Métodos de Entrega' },
    { value: 'ciclos-facturacion', label: 'Ciclos de Facturación' },
    { value: 'planes',             label: 'Planes' },
    { value: 'planes-original',    label: 'Planes Original' },
    { value: 'planes-dscto',       label: 'Planes Descuento' },
    { value: 'estados-mexico',     label: 'Estados México' },
  ];

  itemForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public getTiposLineaUseCase: GetTiposLineaUseCase,
    public createTipoLineaUseCase: CreateTipoLineaUseCase,
    public updateTipoLineaUseCase: UpdateTipoLineaUseCase,
    public getMetodosEntregaUseCase: GetMetodosEntregaUseCase,
    public createMetodoEntregaUseCase: CreateMetodoEntregaUseCase,
    public updateMetodoEntregaUseCase: UpdateMetodoEntregaUseCase,
    public getCiclosFacturacionUseCase: GetCiclosFacturacionUseCase,
    public createCicloFacturacionUseCase: CreateCicloFacturacionUseCase,
    public updateCicloFacturacionUseCase: UpdateCicloFacturacionUseCase,
    public getPlanesUseCase: GetPlanesUseCase,
    public createPlanUseCase: CreatePlanUseCase,
    public updatePlanUseCase: UpdatePlanUseCase,
    public getPlanesOriginalesUseCase: GetPlanesOriginalesUseCase,
    public createPlanOriginalUseCase: CreatePlanOriginalUseCase,
    public updatePlanOriginalUseCase: UpdatePlanOriginalUseCase,
    public getPlanesDsctoUseCase: GetPlanesDsctoUseCase,
    public createPlanDsctoUseCase: CreatePlanDsctoUseCase,
    public updatePlanDsctoUseCase: UpdatePlanDsctoUseCase,
    public getEstadosMexicoUseCase: GetEstadosMexicoUseCase,
    public createEstadoMexicoUseCase: CreateEstadoMexicoUseCase,
    public updateEstadoMexicoUseCase: UpdateEstadoMexicoUseCase,
  ) {
    this.itemForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: [''],
      monto:  [null],
      activo: [true]
    });
  }

  ngOnInit(): void {
    forkJoin([
      this.getTiposLineaUseCase.execute(),
      this.getMetodosEntregaUseCase.execute(),
      this.getCiclosFacturacionUseCase.execute(),
      this.getPlanesUseCase.execute(),
      this.getPlanesOriginalesUseCase.execute(),
      this.getPlanesDsctoUseCase.execute(),
      this.getEstadosMexicoUseCase.execute(),
    ]).subscribe({ error: err => console.error('Error loading generales:', err) });
  }

  setActiveTab(tab: TabType): void {
    this.activeTab.set(tab);
    this.searchTerm.set('');
  }

  openModal(): void {
    this.itemForm.reset({ nombre: '', codigo: '', monto: null, activo: true });
    this.applyValidators();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  private applyValidators(): void {
    const tab = this.activeTab();
    const nombreCtrl = this.itemForm.get('nombre')!;
    const codigoCtrl = this.itemForm.get('codigo')!;
    const montoCtrl  = this.itemForm.get('monto')!;

    nombreCtrl.clearValidators();
    codigoCtrl.clearValidators();
    montoCtrl.clearValidators();

    if (tab === 'ciclos-facturacion') {
      codigoCtrl.setValidators(Validators.required);
    } else if (tab === 'planes-dscto') {
      nombreCtrl.setValidators(Validators.required);
      montoCtrl.setValidators([Validators.required, Validators.min(0)]);
    } else {
      nombreCtrl.setValidators(Validators.required);
    }

    nombreCtrl.updateValueAndValidity();
    codigoCtrl.updateValueAndValidity();
    montoCtrl.updateValueAndValidity();
  }

  async onSubmit(): Promise<void> {
    this.applyValidators();
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const { nombre, codigo, monto, activo } = this.itemForm.value;

    try {
      switch (this.activeTab()) {
        case 'tipos-linea':        await firstValueFrom(this.createTipoLineaUseCase.execute({ nombre, activo })); break;
        case 'metodos-entrega':    await firstValueFrom(this.createMetodoEntregaUseCase.execute({ nombre, activo })); break;
        case 'ciclos-facturacion': await firstValueFrom(this.createCicloFacturacionUseCase.execute({ codigo, activo })); break;
        case 'planes':             await firstValueFrom(this.createPlanUseCase.execute({ nombre, activo })); break;
        case 'planes-original':    await firstValueFrom(this.createPlanOriginalUseCase.execute({ nombre, activo })); break;
        case 'planes-dscto':       await firstValueFrom(this.createPlanDsctoUseCase.execute({ nombre, monto: Number(monto), activo })); break;
        case 'estados-mexico':     await firstValueFrom(this.createEstadoMexicoUseCase.execute({ nombre, activo })); break;
      }
      this.closeModal();
    } catch (err) {
      console.error('Error saving item:', err);
    }
  }

  toggleTipoLinea(item: TipoLinea): void {
    this.updateTipoLineaUseCase.execute({ tipoLineaId: item.tipoLineaId, nombre: item.nombre, activo: !item.activo }).subscribe();
  }

  toggleMetodoEntrega(item: MetodoEntrega): void {
    this.updateMetodoEntregaUseCase.execute({ metodoEntregaId: item.metodoEntregaId, nombre: item.nombre, activo: !item.activo }).subscribe();
  }

  toggleCicloFacturacion(item: CicloFacturacion): void {
    this.updateCicloFacturacionUseCase.execute({ cicloFacturacionId: item.cicloFacturacionId, codigo: item.codigo, activo: !item.activo }).subscribe();
  }

  togglePlan(item: Plan): void {
    this.updatePlanUseCase.execute({ planId: item.planId, nombre: item.nombre, activo: !item.activo }).subscribe();
  }

  togglePlanOriginal(item: PlanOriginal): void {
    this.updatePlanOriginalUseCase.execute({ planOriginalId: item.planOriginalId, nombre: item.nombre, activo: !item.activo }).subscribe();
  }

  togglePlanDscto(item: PlanDscto): void {
    this.updatePlanDsctoUseCase.execute({ planDsctoId: item.planDsctoId, nombre: item.nombre, monto: item.monto, activo: !item.activo }).subscribe();
  }

  toggleEstado(item: EstadoMexico): void {
    this.updateEstadoMexicoUseCase.execute({ estadoId: item.estadoId, nombre: item.nombre, activo: !item.activo }).subscribe();
  }

  getFilteredTiposLinea()      { const t = this.searchTerm().toLowerCase(); return this.getTiposLineaUseCase.tiposLinea().filter(i => i.nombre.toLowerCase().includes(t)); }
  getFilteredMetodosEntrega()  { const t = this.searchTerm().toLowerCase(); return this.getMetodosEntregaUseCase.metodosEntrega().filter(i => i.nombre.toLowerCase().includes(t)); }
  getFilteredCiclos()          { const t = this.searchTerm().toLowerCase(); return this.getCiclosFacturacionUseCase.ciclosFacturacion().filter(i => i.codigo.toLowerCase().includes(t)); }
  getFilteredPlanes()          { const t = this.searchTerm().toLowerCase(); return this.getPlanesUseCase.planes().filter(i => i.nombre.toLowerCase().includes(t)); }
  getFilteredPlanesOriginales(){ const t = this.searchTerm().toLowerCase(); return this.getPlanesOriginalesUseCase.planesOriginales().filter(i => i.nombre.toLowerCase().includes(t)); }
  getFilteredPlanesDscto()     { const t = this.searchTerm().toLowerCase(); return this.getPlanesDsctoUseCase.planesDscto().filter(i => i.nombre.toLowerCase().includes(t)); }
  getFilteredEstados()         { const t = this.searchTerm().toLowerCase(); return this.getEstadosMexicoUseCase.estados().filter(i => i.nombre.toLowerCase().includes(t)); }

  private getActiveList(): any[] {
    switch (this.activeTab()) {
      case 'tipos-linea':        return this.getTiposLineaUseCase.tiposLinea();
      case 'metodos-entrega':    return this.getMetodosEntregaUseCase.metodosEntrega();
      case 'ciclos-facturacion': return this.getCiclosFacturacionUseCase.ciclosFacturacion();
      case 'planes':             return this.getPlanesUseCase.planes();
      case 'planes-original':    return this.getPlanesOriginalesUseCase.planesOriginales();
      case 'planes-dscto':       return this.getPlanesDsctoUseCase.planesDscto();
      case 'estados-mexico':     return this.getEstadosMexicoUseCase.estados();
    }
  }

  getTotal()     { return this.getActiveList().length; }
  getActivos()   { return this.getActiveList().filter((i: any) => i.activo).length; }
  getInactivos() { return this.getTotal() - this.getActivos(); }

  isLoading(): boolean {
    return this.getTiposLineaUseCase.loading()       ||
           this.getMetodosEntregaUseCase.loading()   ||
           this.getCiclosFacturacionUseCase.loading() ||
           this.getPlanesUseCase.loading()           ||
           this.getPlanesOriginalesUseCase.loading() ||
           this.getPlanesDsctoUseCase.loading()      ||
           this.getEstadosMexicoUseCase.loading();
  }

  isCicloTab(): boolean { return this.activeTab() === 'ciclos-facturacion'; }
  isDsctoTab(): boolean { return this.activeTab() === 'planes-dscto'; }

  getModalTitle(): string {
    const map: Record<TabType, string> = {
      'tipos-linea':        'Nuevo Tipo de Línea',
      'metodos-entrega':    'Nuevo Método de Entrega',
      'ciclos-facturacion': 'Nuevo Ciclo de Facturación',
      'planes':             'Nuevo Plan',
      'planes-original':    'Nuevo Plan Original',
      'planes-dscto':       'Nuevo Plan Descuento',
      'estados-mexico':     'Nuevo Estado',
    };
    return map[this.activeTab()];
  }

  getNewButtonText(): string {
    const map: Record<TabType, string> = {
      'tipos-linea':        'Nuevo Tipo',
      'metodos-entrega':    'Nuevo Método',
      'ciclos-facturacion': 'Nuevo Ciclo',
      'planes':             'Nuevo Plan',
      'planes-original':    'Nuevo Plan Original',
      'planes-dscto':       'Nuevo Plan Dscto',
      'estados-mexico':     'Nuevo Estado',
    };
    return map[this.activeTab()];
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.itemForm.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }
}
