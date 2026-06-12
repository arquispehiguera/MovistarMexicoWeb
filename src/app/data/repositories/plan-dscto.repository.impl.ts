import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PlanDsctoRepository, CreatePlanDsctoDto, UpdatePlanDsctoDto } from '../../domain/repositories/plan-dscto.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { PlanDsctoState } from '../state/plan-dscto.state';
import { PlanDsctoMapper } from '../../domain/mappers/plan-dscto.mapper';

@Injectable()
export class PlanDsctoRepositoryImpl extends PlanDsctoRepository {
  private readonly apiUrl = `${environment.apiUrl}/plandscto`;
  private readonly state = inject(PlanDsctoState);

  get planesDscto() { return this.state.planesDscto; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getPlanesDscto(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const planesDscto = response.data.map(item => PlanDsctoMapper.fromDto(item));
        this.state.planesDscto.set(planesDscto);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los planes de descuento');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createPlanDscto(dto: CreatePlanDsctoDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getPlanesDscto()),
      catchError(err => {
        this.state.error.set('Error al crear el plan de descuento');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updatePlanDscto(dto: UpdatePlanDsctoDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, dto).pipe(
      map(() => {
        this.state.planesDscto.update(planes =>
          planes.map(p =>
            p.planDsctoId === dto.planDsctoId
              ? PlanDsctoMapper.fromDto({ planDsctoId: p.planDsctoId, nombre: dto.nombre, monto: dto.monto, activo: dto.activo, fechaCreacion: p.fechaCreacion })
              : p
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el plan de descuento');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
