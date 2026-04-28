import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { BookingStateService } from '../../services/booking-state.service';
import { LocationData } from '../../models/booking.model';

interface SavedAddress {
  id:      string;
  label:   string;
  address: string;
  city:    string;
  lat:     number;
  lng:     number;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [IonContent],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {
  private booking = inject(BookingStateService);
  private router  = inject(Router);

  selectedAddress = signal<SavedAddress | null>(null);

  readonly savedAddresses: SavedAddress[] = [
    { id: 'home',   label: 'Home',   address: '42/1, Flower Road',       city: 'Colombo 07', lat: 6.9147,  lng: 79.8617 },
    { id: 'office', label: 'Office', address: 'No. 5, Galle Road',       city: 'Colombo 03', lat: 6.8972,  lng: 79.8525 },
    { id: 'mum',    label: "Mum's",  address: '18, Negombo Road',        city: 'Wattala',    lat: 6.9891,  lng: 79.8908 },
  ];

  selectAddress(addr: SavedAddress): void {
    this.selectedAddress.set(addr);
  }

  useCurrentLocation(): void {
    // In production: use Capacitor Geolocation + Nominatim reverse geocode
    const mockLoc: SavedAddress = {
      id: 'current', label: 'Current Location',
      address: '42/1, Flower Road', city: 'Colombo 07',
      lat: 6.9147, lng: 79.8617,
    };
    this.selectedAddress.set(mockLoc);
  }

  onConfirm(): void {
    const addr = this.selectedAddress();
    if (!addr) return;
    const location: LocationData = {
      address:  `${addr.address}, ${addr.city}`,
      city:     addr.city,
      district: 'Colombo',
      lat:      addr.lat,
      lng:      addr.lng,
      label:    addr.label,
    };
    this.booking.setLocation(location);
    this.router.navigate(['/customer/booking/schedule']);
  }

  goBack(): void {
    const hasRx = this.booking.requiresPrescription();
    this.router.navigate([hasRx ? '/customer/booking/prescription' : '/customer/booking/select-tests']);
  }
}