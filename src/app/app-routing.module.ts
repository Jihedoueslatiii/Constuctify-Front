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



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
