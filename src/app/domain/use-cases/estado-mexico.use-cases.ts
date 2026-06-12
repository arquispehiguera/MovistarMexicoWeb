import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoMexicoRepository, CreateEstadoMexicoDto, UpdateEstadoMexicoDto } from '../repositories/estado-mexico.repository';

@Injectable({ providedIn: 'root' })
export class GetEstadosMexicoUseCase {
  constructor(private repo: EstadoMexicoRepository) {}
  get estados() { return this.repo.estados; }
  get loading() { return this.repo.loading; }
  get error() { return this.repo.error; }
  execute(): Observable<void> { return this.repo.getEstados(); }
}

@Injectable({ providedIn: 'root' })
export class CreateEstadoMexicoUseCase {
  constructor(private repo: EstadoMexicoRepository) {}
  get loading() { return this.repo.loading; }
  get error() { return this.repo.error; }
  execute(dto: CreateEstadoMexicoDto): Observable<void> { return this.repo.createEstado(dto); }
}

@Injectable({ providedIn: 'root' })
export class UpdateEstadoMexicoUseCase {
  constructor(private repo: EstadoMexicoRepository) {}
  get loading() { return this.repo.loading; }
  get error() { return this.repo.error; }
  execute(dto: UpdateEstadoMexicoDto): Observable<void> { return this.repo.updateEstado(dto); }
}
