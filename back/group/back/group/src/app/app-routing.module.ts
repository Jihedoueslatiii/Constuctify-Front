import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { AddDeliverableComponent } from './Views/delivrable/add-deliverable/add-deliverable.component';
import { ViewDeliverableComponent } from './Views/delivrable/view-deliverable/view-deliverable.component';
import { UpdateDeliverableComponent } from './Views/delivrable/update-deliverable/update-deliverable.component';
import { ProblemRiskListComponent } from './Views/problemrisk/problem-risk-list/problem-risk-list.component';
import { ProblemRiskFormComponent } from './Views/problemrisk/problem-risk-form/problem-risk-form.component';

const routes: Routes = [
  {path:'ViewRessource',component:ViewRessourceComponent},
  {path:'AddRessource',component:AddRessourceComponent},
  {path:'AddDeliverable',component:AddDeliverableComponent},
  {path:'ViewDeliverable',component:ViewDeliverableComponent},
  {path:'UpdateDeliverable/:id',component:UpdateDeliverableComponent},
  { path: 'problem-risks', component: ProblemRiskListComponent },
  { path: 'add-problem-risk', component: ProblemRiskFormComponent },
  { path: 'edit-problem-risk/:id', component: ProblemRiskFormComponent },

  // Route par défaut
  { path: '', redirectTo: 'problem-risks', pathMatch: 'full' },
  // ou tout autre comportement
];

  



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
