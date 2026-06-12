import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PerfilRepository } from '../repositories/perfil.repository';

@Injectable({ providedIn: 'root' })
export class GetPerfilesUseCase {
  constructor(private perfilRepository: PerfilRepository) {}

  execute(): Observable<void> {
    return this.perfilRepository.getPerfiles();
  }
}
