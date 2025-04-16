import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: string[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  removeNotification(notification: string): void {
    this.notificationService.removeNotification(notification);
  }

  clearNotifications(): void {
    this.notificationService.clearNotifications();
  }
}