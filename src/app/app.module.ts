import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DragDropModule } from '@angular/cdk/drag-drop';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './Views/bar/bar.component';
import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { ProjectComponent } from './Views/project/project.component';
import { TaskListComponent } from './Views/task-list/task-list.component';
import { TimesheetComponent } from './Views/timesheet/timesheet.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientInterfaceComponent } from './client-interface/client-interface.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';
import { GeminiChatComponent } from './components/gemini-chat/gemini-chat.component';



@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    ViewRessourceComponent,
    ViewRessourceComponent,
    AddRessourceComponent,
    ProjectComponent,
    TaskListComponent,
     
    
    TimesheetComponent,
         GanttChartComponent,
         KanbanBoardComponent,
         DashboardComponent,
         AppComponent,
         NavbarComponent,
         FooterComponent,
         LandingpageComponent,
         LoginComponent,
         ClientNavbarComponent,
         ClientInterfaceComponent,
         TaskCalendarComponent,
         GeminiChatComponent,
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    FullCalendarModule,
   


    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
