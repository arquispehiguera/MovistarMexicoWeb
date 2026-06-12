import { Injectable, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastr: ToastrService, private zone: NgZone) {}

  success(title: string, message?: string): void {
    this.zone.run(() => this.toastr.success(message, title));
  }

  error(title: string, message?: string): void {
    this.zone.run(() => this.toastr.error(message, title));
  }

  warning(title: string, message?: string): void {
    this.zone.run(() => this.toastr.warning(message, title));
  }

  info(title: string, message?: string): void {
    this.zone.run(() => this.toastr.info(message, title));
  }
}
