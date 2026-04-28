import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { TestCatalogItem } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class TestCatalogService {
  private api = inject(ApiService);

  async getCatalog(): Promise<TestCatalogItem[]> {
    try {
      const res = await this.api.get<TestCatalogItem[]>('/tests/catalog');
      return res.data;
    } catch {
      return this.mockCatalog();
    }
  }

  private mockCatalog(): TestCatalogItem[] {
    return [
      { id: 't1', name: 'Full Blood Count (FBC)',          code: 'FBC-001', priceRs: 1500, sampleType: 'blood',  turnaround: '4–6 hrs',   requiresPrescription: false, category: 'Blood' },
      { id: 't2', name: 'HbA1c (Glycated Hemoglobin)',     code: 'HBA-010', priceRs: 2800, sampleType: 'blood',  turnaround: '2–4 hrs',   requiresPrescription: false, category: 'Blood' },
      { id: 't3', name: 'Lipid Profile',                   code: 'LIP-003', priceRs: 3200, sampleType: 'blood',  turnaround: '6–8 hrs',   requiresPrescription: true,  category: 'Blood' },
      { id: 't4', name: 'Thyroid Stimulating Hormone',     code: 'TSH-005', priceRs: 1850, sampleType: 'blood',  turnaround: '4–6 hrs',   requiresPrescription: false, category: 'Hormone' },
      { id: 't5', name: 'Urine Culture & Sensitivity',     code: 'UCS-012', priceRs: 2200, sampleType: 'urine',  turnaround: '24–48 hrs', requiresPrescription: false, category: 'Urine' },
      { id: 't6', name: 'Fasting Blood Sugar (FBS)',       code: 'FBS-002', priceRs: 650,  sampleType: 'blood',  turnaround: '2–3 hrs',   requiresPrescription: false, category: 'Blood' },
      { id: 't7', name: 'Serum Creatinine',                code: 'CRE-007', priceRs: 900,  sampleType: 'blood',  turnaround: '3–4 hrs',   requiresPrescription: false, category: 'Kidney' },
      { id: 't8', name: 'Urine Full Report',               code: 'UFR-001', priceRs: 550,  sampleType: 'urine',  turnaround: '2–3 hrs',   requiresPrescription: false, category: 'Urine' },
    ];
  }
}