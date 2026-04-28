import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { CustomerHomeData } from '../models/home.model';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private api = inject(ApiService);

  async getHomeData(): Promise<CustomerHomeData> {
    const res = await this.api.get<CustomerHomeData>('/customer/home');
    return res.data;
  }
}