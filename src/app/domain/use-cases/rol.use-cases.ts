import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RolRepository } from '../repositories/rol.repository';
import { Rol } from '../entities/rol.entity';

@Injectable({ providedIn: 'root' })
export class GetRolesUseCase {
  constructor(private rolRepository: RolRepository) {}

  execute(): Observable<Rol[]> {
    return this.rolRepository.getRoles();
  }
}
