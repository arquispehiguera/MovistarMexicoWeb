import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from '../entities/rol.entity';

export abstract class RolRepository {
  abstract roles: Signal<Rol[]>;
  abstract loading: Signal<boolean>;
  abstract error: Signal<string | null>;

  abstract getRoles(): Observable<Rol[]>;
}
