import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Supplier Routes
import { ViewReportsComponent } from './Views/Reports/viewreports/viewreports.component';
import { AddSupplierComponent } from './Views/Supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './Views/Supplier/update-supplier/update-supplier.component';
import { ViewContractsComponent } from './Views/Supplier/view-contracts/view-contracts.component';
import { ViewSupplierComponent } from './Views/Supplier/view-supplier/view-supplier.component';
import { SupplierStatsComponent } from './Views/Supplier/supplier-stats/supplier-stats.component';
import { TranslatedReportsComponent } from './Views/translated-reports/translated-reports.component';

// Auth & Interface
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { ClientInterfaceComponent } from './client-interface/client-interface.component';

// Users & Teams
import { ViewUserComponent } from './Views/User/user-list/user-list.component';
import { UserUpdateComponent } from './Views/User/user-update/user-update.component';
import { AddTeamComponent } from './Views/Teams/add-team/add-team.component';
import { AddEmployerComponent } from './Views/Teams/add-employer/add-employer.component';
import { ListTeamComponent } from './Views/Teams/list-team/list-team.component';
import { EditTeamComponent } from './Views/Teams/edit-team/edit-team.component';
import { SetPasswordComponent } from './Views/Teams/set-password/set-password.component';
import { ListEmployerComponent } from './Views/Teams/list-employer/list-employer.component';

// Logs & Communication
import { AuditComponent } from './Views/Logs/audit/audit.component';
import { ListMessagesComponent } from './Views/Communication/list-messages/list-messages.component';

// Documents
import { ListDocumentsComponent } from './Views/Documentation/list-documents/list-documents.component';
import { FolderDocumentsComponent } from './Views/folder-documents/folder-documents.component';
import { ContractEditorComponent } from './Views/contract-editor/contract-editor.component';

// Ressources
import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { ViewRessourceFrontComponent } from './Views/Ressource/view-ressource-front/view-ressource-front.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { UpdateRessourceComponent } from './Views/Ressource/update-ressource/update-ressource.component';
import { AffectProjectComponent } from './Views/Ressource/affect-project/affect-project.component';
import { DetailRessourceComponent } from './Views/Ressource/detail-ressource/detail-ressource.component';
import { RessourcestatComponent } from './Views/Ressource/ressourcestat/ressourcestat.component';

// Finance
import { ViewFinanceComponent } from './Views/Finance/view-finance/view-finance.component';
import { AddFinanceComponent } from './Views/Finance/add-finance/add-finance.component';
import { UpdateFinanceComponent } from './Views/Finance/update-finance/update-finance.component';
import { ViewfrontComponent } from './Views/Finance/viewfront/viewfront.component';
import { AssignefinancetoprojetComponent } from './Views/Finance/assignefinancetoprojet/assignefinancetoprojet.component';

// Projects & Tasks
import { ProjectComponent } from './Views/project/project.component';
import { ProjectComponent2 } from './projectFront/project.component';
import { TaskListComponent } from './Views/task-list/task-list.component';
import { TimesheetComponent } from './Views/timesheet/timesheet.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';

// Gemini Chat
import { GeminiChatComponent } from './components/gemini-chat/gemini-chat.component';

// Deliverable
import { AddDeliverableComponent } from './Views/delivrable/add-deliverable/add-deliverable.component';
import { ViewDeliverableComponent } from './Views/delivrable/view-deliverable/view-deliverable.component';
import { UpdateDeliverableComponent } from './Views/delivrable/update-deliverable/update-deliverable.component';

// Problem / Risk
import { ProblemRiskListComponent } from './Views/problemrisk/problem-risk-list/problem-risk-list.component';
import { ProblemRiskFormComponent } from './Views/problemrisk/problem-risk-form/problem-risk-form.component';
import { PredictorComponent } from './Views/Finance/predictor/predictor.component';
import { PredictComponent } from './Views/predict/predict.component';
import { RecommandationComponent } from './Views/delivrable/recommandation/recommandation.component';
import { ClusterComponent } from './Views/Supplier/cluster/cluster/cluster.component';

const routes: Routes = [
  // Auth & base
  { path: '', component: LandingpageComponent },
  { path: 'Front', component: LandingpageComponent },
  { path: 'login', component: LoginComponent },

  // Interface
  { path: 'clientInterface', component: ClientInterfaceComponent },
  { path: 'clientInterface/project', component: ProjectComponent2 },

  // Supplier Routes
  { path: 'view-supplier', component: ViewSupplierComponent },
  { path: 'add-supplier', component: AddSupplierComponent },
  { path: 'update-supplier/:id', component: UpdateSupplierComponent },
  
  // Contract Routes
  { path: 'view-contracts', component: ViewContractsComponent },
  { path: 'contract-details/:id', component: ViewContractsComponent },
  
  // Report Routes
  { path: 'view-reports', component: ViewReportsComponent },
  { path: 'reports/translated/:lang', component: TranslatedReportsComponent }, 
  { path: 'archived-reports', component: ViewReportsComponent }, 
  { path: 'delete-reports', component: ViewReportsComponent },
  {  path: 'cluster', component: ClusterComponent },

  
  // Stats Route
  { path: 'supplier-financial-health', component: SupplierStatsComponent },

  // User & Team
  { path: 'users', component: ViewUserComponent },
  { path: 'user-list', component: ViewUserComponent },
  { path: 'update-user/:id', component: UserUpdateComponent },
  { path: 'add-team', component: AddTeamComponent },
  { path: 'add-employer', component: AddEmployerComponent },
  { path: 'list-teams', component: ListTeamComponent },
  { path: 'edit-team', component: EditTeamComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'list-employer', component: ListEmployerComponent },

  // Logs & Docs
  { path: 'logs', component: AuditComponent },
  { path: 'listMessages', component: ListMessagesComponent },
  { path: 'listDocuments', component: ListDocumentsComponent },
  { path: 'folders/:folderId', component: FolderDocumentsComponent },
  { path: 'edit-document/:documentId', component: ContractEditorComponent },
  { path: 'create-document', component: ContractEditorComponent },

  // Ressources
  { path: 'ViewRessource', component: ViewRessourceComponent },
  { path: 'ViewRessourceFront', component: ViewRessourceFrontComponent },
  { path: 'AddRessource', component: AddRessourceComponent },
  { path: 'UpdateRessource/:id', component: UpdateRessourceComponent },
  { path: 'back', component: ViewRessourceComponent },
  { path: 'assign/:id', component: AffectProjectComponent },
  { path: 'detailressource/:id', component: DetailRessourceComponent },
  { path: 'StatRessource', component: RessourcestatComponent },

  // Finance
  { path: 'ViewFinance', component: ViewFinanceComponent },
  { path: 'AddFinance', component: AddFinanceComponent },
  { path: 'UpdateFinance/:id', component: UpdateFinanceComponent },
  { path: 'viewfront', component: ViewfrontComponent },
  { path: 'assignfinance', component: AssignefinancetoprojetComponent },
  { path: 'Predictor', component: PredictorComponent },
  { path: 'predict', component:  PredictComponent },

  // Projects & Tasks
  { path: 'project', component: ProjectComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'gantt', component: GanttChartComponent },
  { path: 'time', component: TimesheetComponent },
  { path: 'kanban', component: KanbanBoardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'calendar', component: TaskCalendarComponent },

  // Gemini
  { path: 'gemini', component: GeminiChatComponent },

  // Deliverables
  { path: 'AddDeliverable', component: AddDeliverableComponent },
  { path: 'ViewDeliverable', component: ViewDeliverableComponent },
  { path: 'UpdateDeliverable/:id', component: UpdateDeliverableComponent },
  {path:'recommandation',component:RecommandationComponent},

  

  // Problems & Risks
  { path: 'problem-risks', component: ProblemRiskListComponent },
  { path: 'add-problem-risk', component: ProblemRiskFormComponent },
  { path: 'edit-problem-risk/:id', component: ProblemRiskFormComponent },

  // Default Redirect
  { path: '', redirectTo: '/view-reports', pathMatch: 'full' },

  // Wildcard Route (should be last)
  { path: '**', redirectTo: '/view-reports' }
];

 


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
