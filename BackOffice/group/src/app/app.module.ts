import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxPaginationModule } from 'ngx-pagination';

// Add these Material modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import 'chartjs-adapter-date-fns';
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
import { BarComponent } from './Views/bar/bar.component';
import { NgChartsModule } from 'ng2-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslatedReportsComponent } from './translated-reports/translated-reports.component';
import { SchedulerComponent } from './Reports/scheduler.component';
import { ScheduleListComponent } from './Reports/schedule-list/schedule-list.component';
import { ScheduleCreatorComponent } from './Reports/schedule-creator/schedule-creator.component';
import { ReportSelectorComponent } from './Reports/report-selector/report-selector.component';
import { ScheduleDialogComponent } from './Reports/report-selector/schedule-dialog/schedule-dialog.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FullCalendarModule } from '@fullcalendar/angular';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ViewSupplierComponent,
    AddSupplierComponent,
    UpdateSupplierComponent,
    DeleteSupplierComponent,
    ViewContractsComponent,
    ViewReportsComponent,
    ReportPopupComponent,
    UpdateReportComponent,
    SupplierStatsComponent,
    FilterStatusPipe,
    BarComponent,
    TranslatedReportsComponent,
    SchedulerComponent,
    ScheduleListComponent,
    ScheduleCreatorComponent,
    ReportSelectorComponent,
    ScheduleDialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    QRCodeModule,
    FullCalendarModule,

    
    
    // Angular Material modules
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    
    DragDropModule,
    NgChartsModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }