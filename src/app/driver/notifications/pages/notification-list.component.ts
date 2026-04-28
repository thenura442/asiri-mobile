// import { Component, OnInit, inject, signal } from '@angular/core';
// import { IonContent } from '@ionic/angular/standalone';
// import { DriverNotificationsService } from '../../services/driver-notifications.service';
// import { DriverAlertGroup, DriverAlert, DriverAlertType } from '../../models/driver-notification.model';

// @Component({
//   selector: 'app-driver-notification-list',
//   standalone: true,
//   imports: [IonContent],
//   templateUrl: './notification-list.component.html',
//   styleUrls: ['./notification-list.component.scss'],
// })
// export class DriverNotificationListComponent implements OnInit {
//   private service = inject(DriverNotificationsService);

//   groups    = signal<DriverAlertGroup[]>([]);
//   isLoading = signal(true);

//   unreadCount = () => this.service.unreadCount(this.groups());

//   async ngOnInit(): Promise<void> {
//     const data = await this.service.getAlerts();
//     this.groups.set(data);
//     this.isLoading.set(false);
//   }

//   async markAllRead(): Promise<void> {
//     await this.service.markAllRead();
//     this.groups.update(gs => gs.map(g => ({
//       ...g,
//       items: g.items.map(n => ({ ...n, unread: false })),
//     })));
//   }

//   iconClass(type: DriverAlertType): string {
//     return { job: 'ico--job', done: 'ico--done', cancellation: 'ico--cancel', warning: 'ico--warn', system: 'ico--sys' }[type];
//   }

//   cardTypeClass(n: DriverAlert): string {
//     const typeMap: Record<DriverAlertType, string> = { job: 'card--job', done: 'card--done', cancellation: 'card--cancel', warning: 'card--warn', system: 'card--sys' };
//     return [n.unread ? 'card--unread' : '', typeMap[n.type]].filter(Boolean).join(' ');
//   }
// }