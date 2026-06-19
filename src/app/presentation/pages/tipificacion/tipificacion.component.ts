import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, firstValueFrom } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskDirective } from 'ngx-mask';
import { CustomDatepickerComponent } from '../../components/custom-datepicker/custom-datepicker.component';
import { CreateRegistroVentaCompletoUseCase } from '../../../domain/use-cases/registro-venta.use-cases';
import { CreateRegistroVentaCompletoDto } from '../../../domain/dtos/registro-venta.dtos';
import { toPeruISOString } from '../../../core/utils/date.utils';
import { CreateDireccionEntregaUseCase } from '../../../domain/use-cases/direccion-entrega.use-cases';
import { CreateDireccionFacturacionUseCase } from '../../../domain/use-cases/direccion-facturacion.use-cases';
import { GetTiposLineaUseCase } from '../../../domain/use-cases/tipo-linea.use-cases';
import { GetMetodosEntregaUseCase } from '../../../domain/use-cases/metodo-entrega.use-cases';
import { GetCiclosFacturacionUseCase } from '../../../domain/use-cases/ciclo-facturacion.use-cases';
import { GetPlanesUseCase } from '../../../domain/use-cases/plan.use-cases';
import { GetPlanesOriginalesUseCase } from '../../../domain/use-cases/plan-original.use-cases';
import { GetPlanesDsctoUseCase } from '../../../domain/use-cases/plan-dscto.use-cases';
import { GetEstadosMexicoUseCase } from '../../../domain/use-cases/estado-mexico.use-cases';
import { GetTematicosUseCase } from '../../../domain/use-cases/tematicos.use-cases';
import { GetFvcsUseCase } from '../../../domain/use-cases/fvc.use-cases';
import { ToastService } from '../../../core/services/toast.service';
import { isInvalid } from '../../../shared/utils/form.utils';
import { APP_ICONS } from '../../../core/config/icons.config';
import { GetAuthStateUseCase } from '../../../domain/use-cases/auth.use-cases';

@Component({
  selector: 'app-tipificacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NgSelectModule,
    NgxMaskDirective,
    CustomDatepickerComponent
  ],
  templateUrl: './tipificacion.component.html',
})
export class TipificacionComponent implements OnInit, OnDestroy {
  readonly ArrowLeft = APP_ICONS.ArrowLeft;
  readonly Clock     = APP_ICONS.Clock;

  readonly fechaMaximaNacimiento: Date = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  step             = signal<1 | 2 | 3 | 4>(1);
  selectedProducto = signal<string | null>(null);
  readonly productos = ['Portabilidad'];

  fechaIngestion    = signal<Date | null>(null);
  fechaFinIngestion = signal<Date | null>(null);

  private timerSeconds  = signal<number>(0);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  timerDisplay = computed(() => {
    const s = this.timerSeconds();
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  });

  form!: FormGroup;
  formEntrega!: FormGroup;
  formFacturacion!: FormGroup;

  tiposLineaActivos = computed(() =>
    this.getTiposLineaUseCase.tiposLinea().filter(t => t.activo)
  );

  readonly companiasDonantes = ['TELCEL', 'AT&T', 'OTROS'];

  metodosEntregaActivos = computed(() =>
    this.getMetodosEntregaUseCase.metodosEntrega().filter(m => m.activo)
  );

  ciclosFacturacionActivos = computed(() =>
    this.getCiclosFacturacionUseCase.ciclosFacturacion().filter(c => c.activo)
  );

  planesActivos = computed(() =>
    this.getPlanesUseCase.planes().filter(p => p.activo)
  );

  planesOriginalesActivos = computed(() =>
    this.getPlanesOriginalesUseCase.planesOriginales().filter(p => p.activo)
  );

  planesDsctoActivos = computed(() =>
    this.getPlanesDsctoUseCase.planesDscto().filter(p => p.activo)
  );

  estadosActivos = computed(() =>
    this.getEstadosMexicoUseCase.estados().filter(e => e.activo)
  );

  tematicosActivos = computed(() =>
    this.getTematicosUseCase.tematicos()
      .filter(t => t.activo)
      .map(t => ({ ...t, label: `${t.resultado} — ${t.motivo}` }))
  );

  fvcsActivos = computed(() =>
    this.getFvcsUseCase.fvcs().filter(f => f.activo)
  );

  constructor(
    private fb: FormBuilder,
    public createRegistroVentaCompletoUseCase: CreateRegistroVentaCompletoUseCase,
    public createDireccionEntregaUseCase: CreateDireccionEntregaUseCase,
    public createDireccionFacturacionUseCase: CreateDireccionFacturacionUseCase,
    public getTiposLineaUseCase: GetTiposLineaUseCase,
    public getMetodosEntregaUseCase: GetMetodosEntregaUseCase,
    public getCiclosFacturacionUseCase: GetCiclosFacturacionUseCase,
    public getPlanesUseCase: GetPlanesUseCase,
    public getPlanesOriginalesUseCase: GetPlanesOriginalesUseCase,
    public getPlanesDsctoUseCase: GetPlanesDsctoUseCase,
    public getEstadosMexicoUseCase: GetEstadosMexicoUseCase,
    public getTematicosUseCase: GetTematicosUseCase,
    public getFvcsUseCase: GetFvcsUseCase,
    private toast: ToastService,
    private authState: GetAuthStateUseCase
  ) {
    this.initForm();
    this.initAddressForms();
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
      this.getTematicosUseCase.execute(),
      this.getFvcsUseCase.execute()
    ]).subscribe();

    this.formFacturacion.get('mismaQueEntrega')!.valueChanges.subscribe((checked: boolean) => {
      if (checked) {
        const e = this.formEntrega.getRawValue();
        this.formFacturacion.patchValue({
          calle: e.calle, numeroExterior: e.numeroExterior, numeroInterior: e.numeroInterior,
          entreCalles: e.entreCalles, referencias: e.referencias, direccionCompleta: e.direccionCompleta,
          codigoPostal: e.codigoPostal, colonia: e.colonia, delegacionMunicipio: e.delegacionMunicipio, estado: e.estado
        });
        this.setAddressFieldsDisabled(this.formFacturacion, true);
      } else {
        this.setAddressFieldsDisabled(this.formFacturacion, false);
        this.formFacturacion.patchValue({
          calle: '', numeroExterior: '', numeroInterior: '', entreCalles: '',
          referencias: '', direccionCompleta: '', codigoPostal: '', colonia: '', delegacionMunicipio: '', estado: ''
        });
      }
    });
  }

  selectProducto(nombre: string): void {
    this.selectedProducto.set(nombre);
    this.fechaIngestion.set(new Date());
    this.fechaFinIngestion.set(null);
    this.timerSeconds.set(0);
    this.startTimer();
    this.step.set(2);
  }

  goBack(): void {
    this.stopTimer();
    this.timerSeconds.set(0);
    this.fechaIngestion.set(null);
    this.fechaFinIngestion.set(null);
    this.step.set(1);
    this.selectedProducto.set(null);
    this.form.reset();
    this.formEntrega.reset();
    this.formFacturacion.reset();
    this.setAddressFieldsDisabled(this.formFacturacion, false);
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => this.timerSeconds.update(s => s + 1), 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  nextStep(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.step.set(3);
  }

  nextStepEntrega(): void {
    this.formEntrega.markAllAsTouched();
    if (this.formEntrega.invalid) return;
    this.step.set(4);
  }

  prevStep(): void {
    const s = this.step();
    if (s === 3) this.step.set(2);
    else if (s === 4) this.step.set(3);
  }

  get obsControl(): FormControl {
    return this.form.get('observaciones') as FormControl;
  }

  invalid(name: string): boolean {
    return isInvalid(this.form.get(name));
  }

  invalidE(name: string): boolean {
    return isInvalid(this.formEntrega.get(name));
  }

  invalidF(name: string): boolean {
    return isInvalid(this.formFacturacion.get(name));
  }

  async onSubmit(): Promise<void> {
    this.formFacturacion.markAllAsTouched();
    if (this.formFacturacion.invalid) return;

    this.fechaFinIngestion.set(new Date());
    this.stopTimer();

    const v = this.form.value;
    const e = this.formEntrega.getRawValue();
    const f = this.formFacturacion.getRawValue();

    const dto: CreateRegistroVentaCompletoDto = {
      venta: {
        usuarioID:          this.authState.user()?.usuarioID || 0,
        tematicoID:         f.tematicoID ?? null,
        producto:           this.selectedProducto()!,
        numeroPortar:       v.numeroPortar || null,
        dn:                 v.dn || null,
        nombres:            v.nombres,
        apellidoPaterno:    v.apellidoPaterno,
        apellidoMaterno:    v.apellidoMaterno || null,
        fechaNacimiento:    v.fechaNacimiento || null,
        telfContacto1:      v.telfContacto1 || null,
        telfContacto2:      v.telfContacto2 || null,
        companiaDonante:    v.companiaDonante || null,
        tipoLinea:          v.tipoLinea || null,
        correoElectronico:  v.correoElectronico || null,
        numero:             v.numero || null,
        ine:                v.ine || null,
        curp:               v.curp || null,
        rfc:                v.rfc || null,
        nip:                v.nip || null,
        metodoEntrega:      v.metodoEntrega || null,
        ciclosFacturacion:  v.ciclosFacturacion || null,
        plan:               v.plan || null,
        planOriginal:       v.planOriginal || null,
        planDcto:           v.planDcto || null,
        observaciones:      v.observaciones || null,
        fvc:                v.fvc || null,
        fechaInicioGestion: this.fechaIngestion() ? toPeruISOString(this.fechaIngestion()!) : null,
        fechaFinGestion:    this.fechaFinIngestion() ? toPeruISOString(this.fechaFinIngestion()!) : null,
        fechaRegistro:      toPeruISOString()
      },
      direccionEntrega: {
        calle:               e.calle || null,
        numeroExterior:      e.numeroExterior || null,
        numeroInterior:      e.numeroInterior || null,
        entreCalles:         e.entreCalles || null,
        referencias:         e.referencias || null,
        codigoPostal:        e.codigoPostal || null,
        colonia:             e.colonia || null,
        delegacionMunicipio: e.delegacionMunicipio || null,
        estado:              e.estado || null,
        direccionCompleta:   e.direccionCompleta || null,
        cav:                 e.cav || null
      },
      direccionFacturacion: {
        calle:               f.calle || null,
        numeroExterior:      f.numeroExterior || null,
        numeroInterior:      f.numeroInterior || null,
        entreCalles:         f.entreCalles || null,
        referencias:         f.referencias || null,
        codigoPostal:        f.codigoPostal || null,
        colonia:             f.colonia || null,
        delegacionMunicipio: f.delegacionMunicipio || null,
        estado:              f.estado || null,
        direccionCompleta:   f.direccionCompleta || null
      }
    };

    let success = false;
    try {
      await firstValueFrom(this.createRegistroVentaCompletoUseCase.execute(dto));
      success = true;
    } catch (err) {
      console.error('[TipificacionComponent] Error al registrar venta:', err);
    }

    if (success) {
      this.toast.success('Registro exitoso', 'Venta registrada correctamente');
      this.goBack();
    }
  }

  private initForm(): void {
    const onlyDigits  = (n: number) => Validators.pattern(new RegExp(`^\\d{${n}}$`));
    const optDigits   = (n: number) => Validators.pattern(new RegExp(`^$|^\\d{${n}}$`));
    const optAlphaNum = (n: number) => Validators.pattern(new RegExp(`^$|^[A-Za-z0-9]{${n}}$`));

    this.form = this.fb.group({
      nombres:           ['', Validators.required],
      apellidoPaterno:   ['', Validators.required],
      apellidoMaterno:   [''],
      fechaNacimiento:   [''],
      correoElectronico: ['', Validators.email],
      numero:            [''],
      ine:               ['', optAlphaNum(18)],
      curp:              ['', optAlphaNum(18)],
      rfc:               ['', optAlphaNum(13)],
      numeroPortar:      ['', [Validators.required, onlyDigits(15)]],
      nip:               ['', [Validators.required, onlyDigits(4)]],
      companiaDonante:   [null, Validators.required],
      tipoLinea:         [null, Validators.required],
      dn:                ['', [Validators.required, onlyDigits(10)]],
      telfContacto1:     ['', optDigits(10)],
      telfContacto2:     ['', optDigits(10)],
      metodoEntrega:     [null, Validators.required],
      ciclosFacturacion: [null, Validators.required],
      plan:              [null, Validators.required],
      planOriginal:      [null],
      planDcto:          [null],
      fvc:               [null, Validators.required],
      observaciones:     ['']
    });
  }

  private buildAddressGroup(): FormGroup {
    return this.fb.group({
      calle:               ['', Validators.required],
      numeroExterior:      ['', Validators.required],
      numeroInterior:      [''],
      entreCalles:         [''],
      referencias:         [''],
      direccionCompleta:   [''],
      codigoPostal:        ['', Validators.required],
      colonia:             ['', Validators.required],
      delegacionMunicipio: ['', Validators.required],
      estado:              [null, Validators.required],
      cav:                 ['']
    });
  }

  private initAddressForms(): void {
    this.formEntrega     = this.buildAddressGroup();
    this.formFacturacion = this.buildAddressGroup();
    this.formFacturacion.addControl('mismaQueEntrega', this.fb.control(false));
    this.formFacturacion.addControl('tematicoID', this.fb.control(null, Validators.required));
  }

  private setAddressFieldsDisabled(form: FormGroup, disabled: boolean): void {
    ['calle', 'numeroExterior', 'numeroInterior', 'entreCalles',
     'referencias', 'direccionCompleta', 'codigoPostal', 'colonia', 'delegacionMunicipio', 'estado']
      .forEach(f => disabled ? form.get(f)!.disable() : form.get(f)!.enable());
  }
}
