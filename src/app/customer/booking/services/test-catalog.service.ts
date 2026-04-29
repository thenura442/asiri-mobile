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
    { id: 't1', name: 'Full Blood Count (FBC)',      code: 'FBC-001', price: 1500, sampleType: 'blood', turnaroundTime: '4–6 hrs',   prescriptionReq: false, timeSensitivityHrs: null },
    { id: 't2', name: 'HbA1c (Glycated Hemoglobin)', code: 'HBA-010', price: 2800, sampleType: 'blood', turnaroundTime: '2–4 hrs',   prescriptionReq: false, timeSensitivityHrs: null },
    { id: 't3', name: 'Lipid Profile',               code: 'LIP-003', price: 3200, sampleType: 'blood', turnaroundTime: '6–8 hrs',   prescriptionReq: true,  timeSensitivityHrs: null },
    { id: 't4', name: 'Thyroid Stimulating Hormone', code: 'TSH-005', price: 1850, sampleType: 'blood', turnaroundTime: '4–6 hrs',   prescriptionReq: false, timeSensitivityHrs: null },
    { id: 't5', name: 'Urine Culture & Sensitivity', code: 'UCS-012', price: 2200, sampleType: 'urine', turnaroundTime: '24–48 hrs', prescriptionReq: false, timeSensitivityHrs: null },
    { id: 't6', name: 'Fasting Blood Sugar (FBS)',   code: 'FBS-002', price: 650,  sampleType: 'blood', turnaroundTime: '2–3 hrs',   prescriptionReq: false, timeSensitivityHrs: null },
    { id: 't7', name: 'Serum Creatinine',            code: 'CRE-007', price: 900,  sampleType: 'blood', turnaroundTime: '3–4 hrs',   prescriptionReq: false, timeSensitivityHrs: null },
    { id: 't8', name: 'Urine Full Report',           code: 'UFR-001', price: 550,  sampleType: 'urine', turnaroundTime: '2–3 hrs',   prescriptionReq: false, timeSensitivityHrs: null },
  ];
}
}