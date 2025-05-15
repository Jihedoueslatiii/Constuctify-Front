import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './Views/bar/bar.component';
import { ViewUserComponent } from './Views/User/user-list/user-list.component';
import { UserUpdateComponent } from './Views/User/user-update/user-update.component';
import { AddTeamComponent } from './Views/Teams/add-team/add-team.component';
import { AddEmployerComponent } from './Views/Teams/add-employer/add-employer.component';
import { ListTeamComponent } from './Views/Teams/list-team/list-team.component';
import { EditTeamComponent } from './Views/Teams/edit-team/edit-team.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientInterfaceComponent } from './client-interface/client-interface.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';


// Third-party Modules
import { ToastrModule } from 'ngx-toastr';

// Modules divers
import { NgxPaginationModule } from 'ngx-pagination';  // Si utilisé pour pagination
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AuditComponent } from './Views/Logs/audit/audit.component';
import { StarRatingComponent } from './Views/Teams/star-rating/star-rating.component';
import { SetPasswordComponent } from './Views/Teams/set-password/set-password.component';
import { ListEmployerComponent } from './Views/Teams/list-employer/list-employer.component';
import { SelectTeamDialogComponent } from './Views/Teams/select-team-dialog/select-team-dialog.component';

//jihed

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { ProjectComponent } from './Views/project/project.component';
import { TaskListComponent } from './Views/task-list/task-list.component';
import { TimesheetComponent } from './Views/timesheet/timesheet.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';
import { GeminiChatComponent } from './components/gemini-chat/gemini-chat.component';
import { ProjectComponent2 } from './projectFront/project.component';





@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LandingpageComponent,
    LoginComponent,
    ClientNavbarComponent,
    ClientInterfaceComponent,
    BarComponent,
    ViewUserComponent,
    UserUpdateComponent,
    AddEmployerComponent,
    AddTeamComponent,
    ListTeamComponent,
    EditTeamComponent,
    AuditComponent,
    StarRatingComponent,
    SetPasswordComponent,
    ListEmployerComponent,
    SelectTeamDialogComponent,
    ViewRessourceComponent,
    AddRessourceComponent,
    ProjectComponent2,
    ProjectComponent,
    TaskListComponent, 
    TimesheetComponent,
         GanttChartComponent,
         KanbanBoardComponent,
         DashboardComponent,
         TaskCalendarComponent,
         GeminiChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatPaginatorModule,
    MatTableModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,  // Obligatoire pour Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    CommonModule,
    DragDropModule,
    FullCalendarModule,
    ToastrModule.forRoot(),  // Configuration globale de Toastr
   
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }


