import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenRefreshStateService {
  private refreshing = false;
  private subject = new BehaviorSubject<boolean | null>(null);

  get isRefreshing(): boolean {
    return this.refreshing;
  }

  readonly result$: Observable<boolean | null> = this.subject.asObservable();

  start(): void {
    this.refreshing = true;
    this.subject.next(null);
  }

  complete(success: boolean): void {
    this.refreshing = false;
    this.subject.next(success);
  }
}
