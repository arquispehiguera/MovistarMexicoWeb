import { Component, input, output, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { APP_ICONS } from '../../../core/config/icons.config';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnDestroy {
  // Inputs
  title = input.required<string>();
  isOpen = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full'>('md');
  showCloseButton = input<boolean>(true);

  // Outputs
  closeModal = output<void>();

  // Internal state
  isClosing = signal(false);

  // Lucide Icons desde configuración centralizada
  readonly XIcon = APP_ICONS.X;

  constructor() {
    // Bloquear scroll del body cuando el modal está abierto
    effect(() => {
      if (this.isOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  ngOnDestroy(): void {
    // IMPORTANTE: Restaurar el scroll cuando el componente se destruye
    document.body.style.overflow = '';
  }

  onClose(): void {
    this.isClosing.set(true);

    // Restaurar el scroll ANTES de cerrar el modal
    document.body.style.overflow = '';

    setTimeout(() => {
      this.closeModal.emit();
      this.isClosing.set(false);
    }, 200); // Duración de la animación
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  getSizeClasses(): string {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      xxl: 'max-w-5xl',
      full: 'max-w-full mx-4'
    };
    return sizes[this.size()];
  }
}
