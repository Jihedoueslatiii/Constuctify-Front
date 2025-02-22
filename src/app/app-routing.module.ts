import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { ProjectComponent } from './Views/project/project.component';
import { TaskListComponent } from './Views/task-list/task-list.component';
import { GanttChartComponent } from './components/gantt-chart/gantt-chart.component';
import { TimesheetComponent } from './Views/timesheet/timesheet.component';

const routes: Routes = [
  {path:'ViewRessource',component:ViewRessourceComponent},
  {path:'AddRessource',component:AddRessourceComponent},
  {path: 'project',component: ProjectComponent},
  { path: 'tasks', component: TaskListComponent },
  { path: 'gantt', component: GanttChartComponent },

  { path: 'time', component: TimesheetComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
