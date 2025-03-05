import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'chartjs-adapter-date-fns'; // Import the date adapter
import { ViewSupplierComponent } from './Views/Supplier/view-supplier/view-supplier.component';
import { AddSupplierComponent } from './Views/Supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './Views/Supplier/update-supplier/update-supplier.component';
import { DeleteSupplierComponent } from './Views/Supplier/delete-supplier/delete-supplier.component';
import { ViewContractsComponent } from './Views/Supplier/view-contracts/view-contracts.component';
import { FilterStatusPipe } from './Views/model/filter-status.pipe';
import { ViewReportsComponent } from './Reports/viewreports/viewreports.component';
import { ReportPopupComponent } from './report-popup/report-popup.component';
import { UpdateReportComponent } from './Reports/updatereport/updatereport.component';
import { SupplierStatsComponent } from './Views/Supplier/supplier-stats/supplier-stats.component';
import { BarComponent } from './Views/bar/bar.component'; // Import BarComponent
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    // App Component
    AppComponent,

    // Back-Office Components
    ViewSupplierComponent,
    AddSupplierComponent,
    UpdateSupplierComponent,
    DeleteSupplierComponent,
    ViewContractsComponent,
    ViewReportsComponent,
    ReportPopupComponent,
    UpdateReportComponent,
    SupplierStatsComponent,

    // Pipes
    FilterStatusPipe,

    // Bar Component
    BarComponent, // Declare BarComponent here
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    DragDropModule,
    NgChartsModule, // Ensure this is a direct reference
    NgxPaginationModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}