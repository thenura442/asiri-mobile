import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http    = inject(HttpClient);
  private storage = inject(StorageService);

  private async getHeaders(): Promise<HttpHeaders> {
    const token = await this.storage.get<string>('accessToken'); // ← fixed key
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  async get<T>(path: string): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    return firstValueFrom(
      this.http.get<ApiResponse<T>>(`${environment.apiUrl}${path}`, { headers })
    );
  }

  async post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    return firstValueFrom(
      this.http.post<ApiResponse<T>>(`${environment.apiUrl}${path}`, body, { headers })
    );
  }

  async patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    return firstValueFrom(
      this.http.patch<ApiResponse<T>>(`${environment.apiUrl}${path}`, body, { headers })
    );
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const headers = await this.getHeaders();
    return firstValueFrom(
      this.http.delete<ApiResponse<T>>(`${environment.apiUrl}${path}`, { headers })
    );
  }
}