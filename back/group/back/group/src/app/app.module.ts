import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { BarComponent } from './Views/bar/bar.component';
import { ViewRessourceComponent } from './Views/Ressource/view-ressource/view-ressource.component';
import { AddRessourceComponent } from './Views/Ressource/add-ressource/add-ressource.component';
import { AddDeliverableComponent } from './Views/delivrable/add-deliverable/add-deliverable.component';
import { ViewDeliverableComponent } from './Views/delivrable/view-deliverable/view-deliverable.component';
import { UpdateDeliverableComponent } from './Views/delivrable/update-deliverable/update-deliverable.component';
import { ProblemRiskListComponent } from './Views/problemrisk/problem-risk-list/problem-risk-list.component';
import { ProblemRiskFormComponent } from './Views/problemrisk/problem-risk-form/problem-risk-form.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationComponent } from './Views/notification/notification.component.spec';



@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    ViewRessourceComponent, 
    AddRessourceComponent,
    AddDeliverableComponent,
    ViewDeliverableComponent,
    UpdateDeliverableComponent,
    ProblemRiskListComponent,
    ProblemRiskFormComponent,
    NotificationComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
