import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { ClientInterfaceComponent } from './client-interface/client-interface.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ViewUserComponent  } from './Views/User/user-list/user-list.component';
import { UserUpdateComponent } from './Views/User/user-update/user-update.component';
import { AddTeamComponent } from './Views/Teams/add-team/add-team.component';
import { AddEmployerComponent } from './Views/Teams/add-employer/add-employer.component';
import { ListTeamComponent } from './Views/Teams/list-team/list-team.component';
import { EditTeamComponent } from './Views/Teams/edit-team/edit-team.component'; 
import { AuditComponent } from './Views/Logs/audit/audit.component';
import { SetPasswordComponent } from './Views/Teams/set-password/set-password.component'; 
import { ListEmployerComponent } from './Views/Teams/list-employer/list-employer.component';

import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { ProjectComponent } from './Views/project/project.component';
import { TaskListComponent } from './Views/task-list/task-list.component';
import { TimesheetComponent } from './Views/timesheet/timesheet.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';
import { GeminiChatComponent } from './components/gemini-chat/gemini-chat.component';
import { ProjectComponent2 } from './projectFront/project.component';


const routes: Routes = [
  { path: 'Front', component: LandingpageComponent },
  { path: 'login', component: LoginComponent },
  {path: 'clientInterface', component:ClientInterfaceComponent},
  {path: '', component:LandingpageComponent},
  { path: 'users', component: ViewUserComponent },
  { path: 'user-list', component: ViewUserComponent },
  { path: 'update-user/:id', component: UserUpdateComponent },
  { path: 'add-team', component: AddTeamComponent },
  { path: 'add-employer', component: AddEmployerComponent },
  { path: 'list-teams', component: ListTeamComponent },
  { path: 'edit-team', component: EditTeamComponent },
  { path: 'logs', component: AuditComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'list-employer', component: ListEmployerComponent },
  { path: 'clientInterface/project', component: ProjectComponent2 }, 
  {path:'ViewRessource',component:ViewRessourceComponent},
  {path:'AddRessource',component:AddRessourceComponent},
  {path: 'project',component: ProjectComponent},
  { path: 'tasks', component: TaskListComponent },
  { path: 'gantt', component:GanttChartComponent },
  { path: 'time', component: TimesheetComponent },
  { path: 'kanban', component: KanbanBoardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  {path: 'clientInterface', component:ClientInterfaceComponent},// ✅ Correct path!
  {path: 'calendar', component:TaskCalendarComponent},// ✅ Correct path!
  {path: 'gemini', component:GeminiChatComponent}// ✅ Correct path!
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
