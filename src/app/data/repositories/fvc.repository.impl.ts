import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CreateFvcDto, FvcRepository, UpdateFvcDto } from '../../domain/repositories/fvc.repository';
import { ApiResponse } from '../../domain/models/api-response.model';
import { FvcState } from '../state/fvc.state';
import { FvcMapper } from '../../domain/mappers/fvc.mapper';

@Injectable()
export class FvcRepositoryImpl extends FvcRepository {
  private readonly apiUrl = `${environment.apiUrl}/fvc`;
  private readonly state = inject(FvcState);

  get fvcs() { return this.state.fvcs; }
  get loading() { return this.state.loading; }
  get error() { return this.state.error; }

  constructor(private http: HttpClient) {
    super();
  }

  getFvcs(): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.get<ApiResponse<any[]>>(this.apiUrl).pipe(
      map(response => {
        const fvcs = response.data.map(item => FvcMapper.fromDto(item));
        this.state.fvcs.set(fvcs);
      }),
      catchError(err => {
        this.state.error.set('Error al cargar los FVC');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  createFvc(dto: CreateFvcDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.post<void>(this.apiUrl, dto).pipe(
      switchMap(() => this.getFvcs()),
      catchError(err => {
        this.state.error.set('Error al crear el FVC');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }

  updateFvc(dto: UpdateFvcDto): Observable<void> {
    this.state.loading.set(true);
    this.state.error.set(null);

    return this.http.put<void>(this.apiUrl, dto).pipe(
      map(() => {
        this.state.fvcs.update(fvcs =>
          fvcs.map(f =>
            f.fvcId === dto.fvcId
              ? FvcMapper.fromDto({ fvcId: f.fvcId, descripcion: dto.descripcion, activo: dto.activo, fechaCreacion: f.fechaCreacion })
              : f
          )
        );
      }),
      catchError(err => {
        this.state.error.set('Error al actualizar el FVC');
        return throwError(() => err);
      }),
      finalize(() => this.state.loading.set(false))
    );
  }
}
