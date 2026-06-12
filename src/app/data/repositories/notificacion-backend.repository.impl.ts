import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import * as signalR from '@microsoft/signalr';

import { environment } from '../../../environments/environment';
import { NotificacionBackendRepository } from '../../domain/repositories/notificacion-backend.repository';
import {
  NotificacionBackendDto,
  ContadorNotificacionesDto,
  MarcarLeidasResponse,
  NotificacionSignalRDto
} from '../../domain/dtos/notificacion-backend.dto';

@Injectable()
export class NotificacionBackendRepositoryImpl extends NotificacionBackendRepository {
  private readonly apiUrl = `${environment.apiUrl}/notificacion`;
  private hubConnection: signalR.HubConnection | null = null;
  private _isConnected = signal(false);

  contador = signal<ContadorNotificacionesDto>({ noLeidas: 0, total: 0 });
  nuevaNotificacion = signal<NotificacionSignalRDto | null>(null);
  isConnected = computed(() => this._isConnected());

  constructor(private http: HttpClient) {
    super();
  }

  getNotificaciones(soloNoLeidas = false): Observable<NotificacionBackendDto[]> {
    const params = new HttpParams().set('soloNoLeidas', soloNoLeidas.toString());
    return this.http.get<NotificacionBackendDto[]>(this.apiUrl, { params });
  }

  getContador(): Observable<ContadorNotificacionesDto> {
    return this.http.get<ContadorNotificacionesDto>(`${this.apiUrl}/contador`);
  }

  cargarContador(): void {
    this.getContador().subscribe({
      next: (c) => this.contador.set(c),
      error: (err) => console.error('Error al cargar contador:', err)
    });
  }

  marcarLeidas(ids: number[]): Observable<MarcarLeidasResponse> {
    return this.http.post<MarcarLeidasResponse>(
      `${this.apiUrl}/marcar-leidas`,
      { notificacionIDs: ids }
    ).pipe(
      tap((response) => this.contador.set(response.contador))
    );
  }

  marcarTodasLeidas(): Observable<MarcarLeidasResponse> {
    return this.http.post<MarcarLeidasResponse>(
      `${this.apiUrl}/marcar-todas-leidas`,
      {}
    ).pipe(
      tap((response) => this.contador.set(response.contador))
    );
  }

  async conectar(): Promise<void> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('[SignalR] No hay token disponible para conectar');
      return;
    }

    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

    const hubUrl = `${environment.hubUrl}/notificaciones`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.None)
      .build();

    this.setupEventHandlers();

    try {
      await this.hubConnection.start();
      this._isConnected.set(true);
      this.cargarContador();
    } catch (err) {
      console.error('[SignalR] Error al conectar:', err);
      this._isConnected.set(false);
    }
  }

  async desconectar(): Promise<void> {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
      } catch (err) {
        console.error('Error al desconectar SignalR:', err);
      } finally {
        this._isConnected.set(false);
        this.hubConnection = null;
      }
    }
  }

  private setupEventHandlers(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('NuevaNotificacion', (notificacion: NotificacionSignalRDto) => {
      this.nuevaNotificacion.set(notificacion);

      // Actualizar contador
      const current = this.contador();
      this.contador.set({
        noLeidas: current.noLeidas + 1,
        total: current.total + 1
      });

      // Reproducir sonido de notificación
      this.reproducirSonido();
    });

    this.hubConnection.on('ContadorActualizado', (nuevoContador: ContadorNotificacionesDto) => {
      this.contador.set(nuevoContador);
    });

    this.hubConnection.onreconnecting(() => { this._isConnected.set(false); });
    this.hubConnection.onreconnected(() => { this._isConnected.set(true); this.cargarContador(); });
    this.hubConnection.onclose(() => { this._isConnected.set(false); });
  }

  private reproducirSonido(): void {
    try {
      const audio = new Audio('https://res.cloudinary.com/ds8pgw1pf/video/upload/v1728571480/penguinui/component-assets/sounds/ding.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.warn('No se pudo reproducir sonido:', err));
    } catch (err) {
      console.warn('Error al crear audio:', err);
    }
  }
}
