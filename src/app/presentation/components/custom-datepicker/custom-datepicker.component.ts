import {
  Component,
  Input,
  forwardRef,
  signal,
  computed,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LucideAngularModule } from 'lucide-angular';
import { NgxMaskDirective } from 'ngx-mask';
import { APP_ICONS } from '../../../core/config/icons.config';

interface MonthOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-custom-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    LucideAngularModule,
    NgxMaskDirective
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatepickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative">
      <!-- Input principal -->
      <div class="relative">
        <input
          type="text"
          [value]="displayValue()"
          (click)="togglePopover()"
          readonly
          [placeholder]="placeholder"
          [class]="inputClass"
          class="cursor-pointer pr-10"
        />
        <lucide-icon
          [img]="CalendarIcon"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          [size]="20"
        ></lucide-icon>
      </div>

      <!-- Popover con calendario -->
      @if (isOpen()) {
        <div class="absolute z-50 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-[320px] animate-fadeIn">
          <!-- Header con mes y año -->
          <div class="flex items-center gap-2 mb-4">
            <!-- Botón anterior -->
            <button
              type="button"
              (click)="previousMonth()"
              class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <lucide-icon [img]="ChevronLeftIcon" [size]="18" class="text-gray-600"></lucide-icon>
            </button>

            <!-- Selector de mes -->
            <ng-select
              class="my-select flex-1"
              [items]="months"
              bindLabel="label"
              bindValue="value"
              [ngModel]="selectedMonth()"
              (ngModelChange)="onMonthChange($event)"
              [clearable]="false"
              [searchable]="false"
            ></ng-select>

            <!-- Input de año -->
            <input
              type="text"
              [ngModel]="selectedYear()"
              (ngModelChange)="onYearChange($event)"
              mask="0000"
              class="w-20 text-center input font-medium"
            />

            <!-- Botón siguiente -->
            <button
              type="button"
              (click)="nextMonth()"
              class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <lucide-icon [img]="ChevronRightIcon" [size]="18" class="text-gray-600"></lucide-icon>
            </button>
          </div>

          <!-- Días de la semana -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            @for (day of weekDays; track day) {
              <div class="text-center text-xs font-semibold text-gray-500 py-1">
                {{ day }}
              </div>
            }
          </div>

          <!-- Calendario -->
          <div class="grid grid-cols-7 gap-1">
            @for (day of calendarDays(); track $index) {
              <button
                type="button"
                (click)="selectDay(day)"
                [disabled]="!day.currentMonth || isDateDisabled(day)"
                [class]="getDayClass(day)"
                class="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150"
              >
                {{ day.day }}
              </button>
            }
          </div>

          <!-- Footer -->
          <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              (click)="selectToday()"
              class="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Hoy
            </button>
            <button
              type="button"
              (click)="clearDate()"
              class="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      }

      <!-- Overlay para cerrar -->
      @if (isOpen()) {
        <div
          class="fixed inset-0 z-40"
          (click)="closePopover()"
        ></div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-fadeIn {
      animation: fadeIn 0.15s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    :host ::ng-deep .my-select .ng-select-container {
      height: 42px !important;
      min-height: 42px !important;
    }
  `]
})
export class CustomDatepickerComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder = 'Seleccione una fecha';
  @Input() inputClass = 'block w-full input px-4 py-2';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() disablePastDates = false;

  readonly CalendarIcon = APP_ICONS.Calendar;
  readonly ChevronLeftIcon = APP_ICONS.ChevronLeft;
  readonly ChevronRightIcon = APP_ICONS.ChevronRight;

  isOpen = signal(false);
  selectedDate = signal<Date | null>(null);
  selectedMonth = signal(new Date().getMonth());
  selectedYear = signal(new Date().getFullYear());
  minYear = 1900;
  maxYear = 2100;

  weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

  months: MonthOption[] = [
    { value: 0, label: 'Enero' },
    { value: 1, label: 'Febrero' },
    { value: 2, label: 'Marzo' },
    { value: 3, label: 'Abril' },
    { value: 4, label: 'Mayo' },
    { value: 5, label: 'Junio' },
    { value: 6, label: 'Julio' },
    { value: 7, label: 'Agosto' },
    { value: 8, label: 'Septiembre' },
    { value: 9, label: 'Octubre' },
    { value: 10, label: 'Noviembre' },
    { value: 11, label: 'Diciembre' }
  ];

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  displayValue = computed(() => {
    const date = this.selectedDate();
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  calendarDays = computed(() => {
    return this.generateCalendarDays(this.selectedYear(), this.selectedMonth());
  });

  ngOnInit(): void {
    if (this.disablePastDates && !this.minDate) {
      this.minDate = new Date();
      this.minDate.setHours(0, 0, 0, 0);
    }
  }

  writeValue(value: string): void {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        this.selectedDate.set(date);
        this.selectedMonth.set(date.getMonth());
        this.selectedYear.set(date.getFullYear());
      }
    } else {
      this.selectedDate.set(null);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  togglePopover(): void {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      const date = this.selectedDate() || new Date();
      this.selectedMonth.set(date.getMonth());
      this.selectedYear.set(date.getFullYear());
    }
  }

  closePopover(): void {
    this.isOpen.set(false);
    this.onTouched();
  }

  onMonthChange(value: number): void {
    this.selectedMonth.set(value);
  }

  onYearChange(value: string | number): void {
    const strValue = String(value);
    // Solo actualizar cuando tengamos 4 dígitos completos
    if (strValue.length === 4) {
      const numValue = parseInt(strValue, 10);
      if (!isNaN(numValue)) {
        if (numValue < this.minYear) {
          this.selectedYear.set(this.minYear);
        } else if (numValue > this.maxYear) {
          this.selectedYear.set(this.maxYear);
        } else {
          this.selectedYear.set(numValue);
        }
      }
    }
  }

  previousMonth(): void {
    if (this.selectedMonth() === 0) {
      this.selectedMonth.set(11);
      this.selectedYear.update(y => y - 1);
    } else {
      this.selectedMonth.update(m => m - 1);
    }
  }

  nextMonth(): void {
    if (this.selectedMonth() === 11) {
      this.selectedMonth.set(0);
      this.selectedYear.update(y => y + 1);
    } else {
      this.selectedMonth.update(m => m + 1);
    }
  }

  selectDay(day: { day: number; currentMonth: boolean; date: Date }): void {
    if (!day.currentMonth || this.isDateDisabled(day)) return;

    this.selectedDate.set(day.date);
    const value = this.displayValue();
    this.onChange(value);
    this.closePopover();
  }

  selectToday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!this.isDateDisabledByDate(today)) {
      this.selectedDate.set(today);
      this.selectedMonth.set(today.getMonth());
      this.selectedYear.set(today.getFullYear());
      const value = this.displayValue();
      this.onChange(value);
      this.closePopover();
    }
  }

  clearDate(): void {
    this.selectedDate.set(null);
    this.onChange('');
    this.closePopover();
  }

  isDateDisabled(day: { date: Date }): boolean {
    return this.isDateDisabledByDate(day.date);
  }

  private isDateDisabledByDate(date: Date): boolean {
    if (this.minDate) {
      const min = new Date(this.minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }
    if (this.maxDate) {
      const max = new Date(this.maxDate);
      max.setHours(23, 59, 59, 999);
      if (date > max) return true;
    }
    return false;
  }

  getDayClass(day: { day: number; currentMonth: boolean; date: Date }): string {
    const classes: string[] = [];

    if (!day.currentMonth) {
      classes.push('text-gray-300 cursor-not-allowed');
    } else if (this.isDateDisabled(day)) {
      classes.push('text-gray-300 cursor-not-allowed');
    } else {
      classes.push('hover:bg-primary/10 cursor-pointer');

      // Verificar si es hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      if (dayDate.getTime() === today.getTime()) {
        classes.push('border-2 border-primary text-primary');
      }

      // Verificar si está seleccionado
      const selected = this.selectedDate();
      if (selected) {
        const selectedDate = new Date(selected);
        selectedDate.setHours(0, 0, 0, 0);
        if (dayDate.getTime() === selectedDate.getTime()) {
          classes.push('bg-primary text-white hover:bg-primary');
        }
      }
    }

    return classes.join(' ');
  }

  private generateCalendarDays(year: number, month: number): { day: number; currentMonth: boolean; date: Date }[] {
    const days: { day: number; currentMonth: boolean; date: Date }[] = [];

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Ajustar para que la semana empiece en lunes
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    // Días del mes anterior
    const prevMonth = new Date(year, month, 0);
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      days.push({
        day,
        currentMonth: false,
        date: new Date(year, month - 1, day)
      });
    }

    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Días del siguiente mes para completar la cuadrícula
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  }
}
