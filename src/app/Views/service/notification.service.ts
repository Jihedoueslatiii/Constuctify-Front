import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  // Ajouter une notification
  addNotification(message: string): void {
    const notifications = this.notificationsSubject.getValue();
    const updatedNotifications = [...notifications, message];
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  // Charger les notifications depuis le localStorage
  private loadNotifications(): void {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const notifications = JSON.parse(savedNotifications);
      this.notificationsSubject.next(notifications);
    }
  }

  // Sauvegarder les notifications dans le localStorage
  private saveNotifications(notifications: string[]): void {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }

  // Supprimer une notification
  removeNotification(notification: string): void {
    const notifications = this.notificationsSubject.getValue();
    const updatedNotifications = notifications.filter(n => n !== notification);
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  // Supprimer toutes les notifications
  clearNotifications(): void {
    this.notificationsSubject.next([]);
    localStorage.removeItem('notifications');
  }
}