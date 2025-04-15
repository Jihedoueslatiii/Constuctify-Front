import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { ProjectComponent } from './Views/project/project.component';
import { TaskListComponent } from './Views/task-list/task-list.component';
import { TimesheetComponent } from './Views/timesheet/timesheet.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { ClientInterfaceComponent } from './client-interface/client-interface.component';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';
import { GeminiChatComponent } from './components/gemini-chat/gemini-chat.component';

const routes: Routes = [
  {path:'ViewRessource',component:ViewRessourceComponent},
  {path:'AddRessource',component:AddRessourceComponent},
  {path: 'project',component: ProjectComponent},
  { path: 'tasks', component: TaskListComponent },
  { path: 'gantt', component:GanttChartComponent },

  { path: 'time', component: TimesheetComponent },
  { path: 'kanban', component: KanbanBoardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'clientInterface/project', component: ProjectComponent }, 
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
