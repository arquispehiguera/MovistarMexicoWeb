import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ComunicadoRepository } from '../../domain/repositories/comunicado.repository';
import {
  ComunicadoDto,
  CreateComunicadoDto,
  UpdateComunicadoDto,
  CreateComunicadoResponse
} from '../../domain/models/comunicado.model';

@Injectable()
export class ComunicadoRepositoryImpl extends ComunicadoRepository {
  private readonly apiUrl = `${environment.apiUrl}/comunicado`;

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<ComunicadoDto[]> {
    return this.http.get<ComunicadoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<ComunicadoDto> {
    return this.http.get<ComunicadoDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateComunicadoDto): Observable<CreateComunicadoResponse> {
    return this.http.post<CreateComunicadoResponse>(this.apiUrl, dto);
  }

  update(dto: UpdateComunicadoDto): Observable<void> {
    return this.http.put<void>(this.apiUrl, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
