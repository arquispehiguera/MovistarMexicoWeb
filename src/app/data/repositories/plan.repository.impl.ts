import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PlanRepository, CreatePlanDto, UpdatePlanDto } from '../../domain/repositories/plan.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { PlanState } from '../state/plan.state';
import { PlanMapper } from '../../domain/mappers/plan.mapper';

@Injectable()
export class PlanRepositoryImpl extends PlanRepository {
  private readonly apiUrl = `${environment.apiUrl}/plan`;
  private readonly state = inject(PlanState);

  get planes() { return this.state.planes; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getPlanes(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const planes = response.data.map(item => PlanMapper.fromDto(item));
        this.state.planes.set(planes);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los planes');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createPlan(dto: CreatePlanDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getPlanes()),
      catchError(err => {
        this.state.error.set('Error al crear el plan');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updatePlan(dto: UpdatePlanDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, dto).pipe(
      map(() => {
        this.state.planes.update(planes =>
          planes.map(p =>
            p.planId === dto.planId
              ? PlanMapper.fromDto({ planId: p.planId, nombre: dto.nombre, activo: dto.activo, fechaCreacion: p.fechaCreacion })
              : p
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el plan');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
