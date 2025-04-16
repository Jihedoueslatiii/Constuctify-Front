import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css'],
})
export class BarComponent implements OnInit {
  @Output() searchEvent = new EventEmitter<string>();

  isSidebarClosed = false;
  activeMenu: string | null = null;
  showNotifications = false; // Contrôle l'affichage des notifications
  notificationCount = 0; // Compteur de notifications
  notifications: string[] = []; // Liste des notifications

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Abonnement aux notifications
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
      this.notificationCount = notifications.length;
    });
  }

  // Basculer l'affichage de la barre latérale
  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  // Basculer l'affichage des sous-menus
  toggleSubMenu(menu: string): void {
    this.activeMenu = this.activeMenu === menu ? null : menu;
  }

  // Gérer les changements dans la barre de recherche
  onSearchChange(event: any): void {
    console.log('Recherche saisie :', event.target.value);
    this.searchEvent.emit(event.target.value);
  }

  // Basculer l'affichage des notifications
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  // Supprimer une notification
  removeNotification(notification: string): void {
    this.notificationService.removeNotification(notification);
  }

  // Supprimer toutes les notifications
  clearNotifications(): void {
    this.notificationService.clearNotifications();
  }
}