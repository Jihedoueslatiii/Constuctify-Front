import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

// ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Charts
import { NgChartsModule } from 'ng2-charts';
import 'chartjs-adapter-date-fns';

// AOT factory function


// Composants principaux
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { ClientNavbarComponent } from './client-navbar/client-navbar.component';
import { ClientInterfaceComponent } from './client-interface/client-interface.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarComponent } from './Views/bar/bar.component';

// Utilisateurs
import { ViewUserComponent } from './Views/User/user-list/user-list.component';
import { UserUpdateComponent } from './Views/User/user-update/user-update.component';

// Équipes
import { AddTeamComponent } from './Views/Teams/add-team/add-team.component';
import { AddEmployerComponent } from './Views/Teams/add-employer/add-employer.component';
import { ListTeamComponent } from './Views/Teams/list-team/list-team.component';
import { EditTeamComponent } from './Views/Teams/edit-team/edit-team.component';
import { ListEmployerComponent } from './Views/Teams/list-employer/list-employer.component';
import { SelectTeamDialogComponent } from './Views/Teams/select-team-dialog/select-team-dialog.component';
import { SetPasswordComponent } from './Views/Teams/set-password/set-password.component';
import { StarRatingComponent } from './Views/Teams/star-rating/star-rating.component';

// Ressources
import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { UpdateRessourceComponent } from './Views/Ressource/update-ressource/update-ressource.component';
import { ViewRessourceFrontComponent } from './Views/Ressource/view-ressource-front/view-ressource-front.component';
import { AffectProjectComponent } from './Views/Ressource/affect-project/affect-project.component';
import { RessourcestatComponent } from './Views/Ressource/ressourcestat/ressourcestat.component';
import { DetailRessourceComponent } from './Views/Ressource/detail-ressource/detail-ressource.component';

// Finances
import { ViewfrontComponent } from './Views/Finance/viewfront/viewfront.component';
import { AssignefinancetoprojetComponent } from './Views/Finance/assignefinancetoprojet/assignefinancetoprojet.component';
import { ViewFinanceComponent } from './Views/Finance/view-finance/view-finance.component';
import { AddFinanceComponent } from './Views/Finance/add-finance/add-finance.component';
import { UpdateFinanceComponent } from './Views/Finance/update-finance/update-finance.component';

// Projets & Tâches
import { ProjectComponent } from './Views/project/project.component';
import { ProjectComponent2 } from './projectFront/project.component';
import { TaskListComponent } from './Views/task-list/task-list.component';
import { TimesheetComponent } from './Views/timesheet/timesheet.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';

// Logs / Audit
import { AuditComponent } from './Views/Logs/audit/audit.component';

// Communication / Docs
import { ListMessagesComponent } from './Views/Communication/list-messages/list-messages.component';
import { DocumentModalComponent } from './Views/document-modal/document-modal.component';
import { DocumentUploadFormComponent } from './Views/document-upload-form/document-upload-form.component';
import { ListDocumentsComponent } from './Views/Documentation/list-documents/list-documents.component';
import { ContractEditorComponent } from './Views/contract-editor/contract-editor.component';
import { FolderDocumentsComponent } from './Views/folder-documents/folder-documents.component';

// Chat IA
import { GeminiChatComponent } from './components/gemini-chat/gemini-chat.component';

// Deliverables & Problem-Risk
import { AddDeliverableComponent } from './Views/delivrable/add-deliverable/add-deliverable.component';
import { ViewDeliverableComponent } from './Views/delivrable/view-deliverable/view-deliverable.component';
import { UpdateDeliverableComponent } from './Views/delivrable/update-deliverable/update-deliverable.component';
import { ProblemRiskListComponent } from './Views/problemrisk/problem-risk-list/problem-risk-list.component';
import { ProblemRiskFormComponent } from './Views/problemrisk/problem-risk-form/problem-risk-form.component';

// Reports
import { ViewReportsComponent } from './Views/Reports/viewreports/viewreports.component';
import { ReportPopupComponent } from './Views/report-popup/report-popup.component';
import { UpdateReportComponent } from './Views/Reports/updatereport/updatereport.component';
import { SupplierStatsComponent } from './Views/Supplier/supplier-stats/supplier-stats.component';
import { TranslatedReportsComponent } from './Views/translated-reports/translated-reports.component';
import { SchedulerComponent } from './Views/Reports/scheduler.component';
import { ScheduleListComponent } from './Views/Reports/schedule-list/schedule-list.component';
import { ScheduleCreatorComponent } from './Views/Reports/schedule-creator/schedule-creator.component';
import { ReportSelectorComponent } from './Views/Reports/report-selector/report-selector.component';
import { ScheduleDialogComponent } from './Views/Reports/report-selector/schedule-dialog/schedule-dialog.component';

// Supplier
import { ViewSupplierComponent } from './Views/Supplier/view-supplier/view-supplier.component';
import { AddSupplierComponent } from './Views/Supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './Views/Supplier/update-supplier/update-supplier.component';
import { DeleteSupplierComponent } from './Views/Supplier/delete-supplier/delete-supplier.component';
import { ViewContractsComponent } from './Views/Supplier/view-contracts/view-contracts.component';

// Pipes
import { FilterStatusPipe } from './Views/model/filter-status.pipe';

// Notification
import { NotificationComponent } from './Views/notification/notification.component.spec';

// Modules Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

// Modules externes
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { AuthInterceptor } from './auth.interceptor';
import { PredictorComponent } from './Views/Finance/predictor/predictor.component';
import { PredictComponent } from './Views/predict/predict.component';
import { RecommandationComponent } from './Views/delivrable/recommandation/recommandation.component';
import { ClusterComponent } from './Views/Supplier/cluster/cluster/cluster.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LandingpageComponent,
    LoginComponent,
    ClientNavbarComponent,
    ClientInterfaceComponent,
    DashboardComponent,
    BarComponent,

    // Utilisateurs
    ViewUserComponent,
    UserUpdateComponent,

    // Équipes
    AddTeamComponent,
    AddEmployerComponent,
    ListTeamComponent,
    EditTeamComponent,
    ListEmployerComponent,
    SelectTeamDialogComponent,
    SetPasswordComponent,
    StarRatingComponent,

    // Ressources
    ViewRessourceComponent,
    AddRessourceComponent,
    UpdateRessourceComponent,
    ViewRessourceFrontComponent,
    AffectProjectComponent,
    RessourcestatComponent,
    DetailRessourceComponent,

    // Finances
    ViewfrontComponent,
    AssignefinancetoprojetComponent,
    ViewFinanceComponent,
    AddFinanceComponent,
    UpdateFinanceComponent,

    // Projets & Tâches
    ProjectComponent,
    ProjectComponent2,
    TaskListComponent,
    TimesheetComponent,
    GanttChartComponent,
    KanbanBoardComponent,
    TaskCalendarComponent,
    
    
  
    

    // Logs
    AuditComponent,

    // Chat IA
    GeminiChatComponent,

    // Communication / Docs
    ListMessagesComponent,
    DocumentModalComponent,
    DocumentUploadFormComponent,
    ListDocumentsComponent,
    ContractEditorComponent,
    FolderDocumentsComponent,

    // Deliverables & Risk
    AddDeliverableComponent,
    ViewDeliverableComponent,
    UpdateDeliverableComponent,
    ProblemRiskListComponent,
    ProblemRiskFormComponent,

    // Reports
    ViewReportsComponent,
    ReportPopupComponent,
    UpdateReportComponent,
    SupplierStatsComponent,
    TranslatedReportsComponent,
    SchedulerComponent,
    ScheduleListComponent,
    ScheduleCreatorComponent,
    ReportSelectorComponent,
    ScheduleDialogComponent,
    // Supplier
    ViewSupplierComponent,
    AddSupplierComponent,
    UpdateSupplierComponent,
    DeleteSupplierComponent,
    ViewContractsComponent,
    ClusterComponent,

    FilterStatusPipe,
    NotificationComponent,
    PredictorComponent,
    PredictComponent,
    RecommandationComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonModule,
    EditorModule,
    PickerModule,


    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatPaginatorModule,
    MatTableModule,

    // Modules externes
    DragDropModule,
    FullCalendarModule,
    NgxPaginationModule,
    NgChartsModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory, // ← Ceci est maintenant une référence statique
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
