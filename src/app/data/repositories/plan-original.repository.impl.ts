import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PlanOriginalRepository, CreatePlanOriginalDto, UpdatePlanOriginalDto } from '../../domain/repositories/plan-original.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { PlanOriginalState } from '../state/plan-original.state';
import { PlanOriginalMapper } from '../../domain/mappers/plan-original.mapper';

@Injectable()
export class PlanOriginalRepositoryImpl extends PlanOriginalRepository {
  private readonly apiUrl = `${environment.apiUrl}/planoriginal`;
  private readonly state = inject(PlanOriginalState);

  get planesOriginales() { return this.state.planesOriginales; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getPlanesOriginales(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const planesOriginales = response.data.map(item => PlanOriginalMapper.fromDto(item));
        this.state.planesOriginales.set(planesOriginales);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los planes originales');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createPlanOriginal(dto: CreatePlanOriginalDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getPlanesOriginales()),
      catchError(err => {
        this.state.error.set('Error al crear el plan original');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updatePlanOriginal(dto: UpdatePlanOriginalDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, dto).pipe(
      map(() => {
        this.state.planesOriginales.update(planes =>
          planes.map(p =>
            p.planOriginalId === dto.planOriginalId
              ? PlanOriginalMapper.fromDto({ planOriginalId: p.planOriginalId, nombre: dto.nombre, activo: dto.activo, fechaCreacion: p.fechaCreacion })
              : p
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el plan original');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
