import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

interface ChatMessage {
  id:     number;
  text:   string;
  sender: 'sent' | 'recv';
  time:   string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  private router = inject(Router);

  // Static mock messages — shown behind the "Coming Soon" overlay
  readonly messages: ChatMessage[] = [
    { id: 1, text: 'Good morning Kamal! Your first job today is REQ-0847, patient in Colombo 07.', sender: 'recv', time: '09:10 AM' },
    { id: 2, text: 'Good morning! On it. Heading out now.', sender: 'sent', time: '09:15 AM' },
    { id: 3, text: 'Great. Patient is VIP — please confirm fasting before collection. Also note pending charges of Rs. 450.', sender: 'recv', time: '09:16 AM' },
    { id: 4, text: 'Noted, will check fasting and inform about charges. ETA around 20 mins.', sender: 'sent', time: '09:18 AM' },
    { id: 5, text: 'Perfect. Drive safe!', sender: 'recv', time: '09:18 AM' },
  ];

  goBack(): void { this.router.navigate(['/driver/pushed/settings']); }
}