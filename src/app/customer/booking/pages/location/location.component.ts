import { Component, signal, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { BookingStateService } from '../../services/booking-state.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { LocationData } from '../../models/booking.model';
import { NavController } from '@ionic/angular/standalone';

interface SavedAddress {
  id:      string;
  label:   string;
  address: string;
  city:    string;
  lat:     number;
  lng:     number;
}

interface SearchResult {
  place_id:    number;
  display_name: string;
  lat:         string;
  lon:         string;
  address:     {
    city?:     string;
    town?:     string;
    village?:  string;
    suburb?:   string;
  };
}

@Component({
  selector: 'app-location',
  standalone: true,
  host: { class: 'ion-page' },
  imports: [IonContent, FormsModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent {
  private booking = inject(BookingStateService);
  private nav     = inject(NavController);
  private toast   = inject(ToastService);

  selectedAddress = signal<SavedAddress | null>(null);
  isLocating      = signal(false);
  searchQuery     = signal('');
  searchResults   = signal<SearchResult[]>([]);
  isSearching     = signal(false);
  showResults     = signal(false);

  private searchTimer?: ReturnType<typeof setTimeout>;

  readonly savedAddresses: SavedAddress[] = [
    { id: 'home',   label: 'Home',   address: '42/1, Flower Road', city: 'Colombo 07', lat: 6.9147, lng: 79.8617 },
    { id: 'office', label: 'Office', address: 'No. 5, Galle Road', city: 'Colombo 03', lat: 6.8972, lng: 79.8525 },
    { id: 'mum',    label: "Mum's",  address: '18, Negombo Road',  city: 'Wattala',    lat: 6.9891, lng: 79.8908 },
  ];

  onSearchInput(query: string): void {
    this.searchQuery.set(query);
    clearTimeout(this.searchTimer);

    if (query.trim().length < 3) {
      this.searchResults.set([]);
      this.showResults.set(false);
      return;
    }

    // Debounce 400ms
    this.searchTimer = setTimeout(() => this.doSearch(query), 400);
  }

  private async doSearch(query: string): Promise<void> {
    this.isSearching.set(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=lk`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data: SearchResult[] = await res.json();
      this.searchResults.set(data);
      this.showResults.set(data.length > 0);
    } catch {
      this.searchResults.set([]);
      this.showResults.set(false);
    } finally {
      this.isSearching.set(false);
    }
  }

  selectSearchResult(result: SearchResult): void {
    const city = result.address?.city
      ?? result.address?.town
      ?? result.address?.village
      ?? result.address?.suburb
      ?? 'Sri Lanka';

    const parts  = result.display_name.split(',');
    const address = parts.slice(0, 3).join(',').trim();

    this.selectedAddress.set({
      id:      `search-${result.place_id}`,
      label:   'Searched Location',
      address,
      city,
      lat:     parseFloat(result.lat),
      lng:     parseFloat(result.lon),
    });

    this.searchQuery.set(address);
    this.showResults.set(false);
    this.searchResults.set([]);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showResults.set(false);
  }

  selectAddress(addr: SavedAddress): void {
    this.selectedAddress.set(addr);
    this.clearSearch();
  }

  async useCurrentLocation(): Promise<void> {
    if (!navigator.geolocation) {
      await this.toast.showError('Geolocation is not supported on this device.');
      return;
    }

    this.isLocating.set(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const address = data.display_name ?? 'Current Location';
          const city    = data.address?.city ?? data.address?.town ?? data.address?.village ?? 'Unknown';

          this.selectedAddress.set({
            id:      'current',
            label:   'Current Location',
            address: address.split(',').slice(0, 3).join(',').trim(),
            city,
            lat:     latitude,
            lng:     longitude,
          });
        } catch {
          this.selectedAddress.set({
            id:      'current',
            label:   'Current Location',
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            city:    'Unknown',
            lat:     latitude,
            lng:     longitude,
          });
        } finally {
          this.isLocating.set(false);
        }
      },
      async (error) => {
        this.isLocating.set(false);
        if (error.code === error.PERMISSION_DENIED) {
          await this.toast.showError('Location permission denied. Please select an address manually.');
        } else {
          await this.toast.showError('Could not get your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async onConfirm(): Promise<void> {
    const addr = this.selectedAddress();
    if (!addr) {
      await this.toast.showError('Please select a location first.');
      return;
    }
    const location: LocationData = {
      address:  `${addr.address}, ${addr.city}`,
      city:     addr.city,
      district: 'Colombo',
      lat:      addr.lat,
      lng:      addr.lng,
      label:    addr.label,
    };
    this.booking.setLocation(location);
    this.nav.navigateRoot('/customer/booking/schedule');
  }

  goBack(): void {
    const hasRx = this.booking.requiresPrescription();
    this.nav.navigateRoot(hasRx ? '/customer/booking/prescription' : '/customer/booking/select-tests');
  }
}