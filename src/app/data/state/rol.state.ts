import { Injectable, signal } from '@angular/core';
import { Rol } from '../../domain/entities/rol.entity';

@Injectable({ providedIn: 'root' })
export class RolState {
  readonly roles = signal<Rol[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
