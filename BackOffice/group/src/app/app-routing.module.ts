import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReportsComponent } from './Reports/viewreports/viewreports.component';
import { AddSupplierComponent } from './Views/Supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './Views/Supplier/update-supplier/update-supplier.component';
import { ViewContractsComponent } from './Views/Supplier/view-contracts/view-contracts.component';
import { ViewSupplierComponent } from './Views/Supplier/view-supplier/view-supplier.component';
import { SupplierStatsComponent } from './Views/Supplier/supplier-stats/supplier-stats.component';
import { TranslatedReportsComponent } from './translated-reports/translated-reports.component';


const routes: Routes = [
  // Supplier Routes
  { path: 'view-supplier', component: ViewSupplierComponent },
  { path: 'add-supplier', component: AddSupplierComponent },
  { path: 'update-supplier/:id', component: UpdateSupplierComponent },
  
  // Contract Routes
  { path: 'view-contracts', component: ViewContractsComponent },
  { path: 'contract-details/:id', component: ViewContractsComponent },
  
  // Report Routes
  { path: 'view-reports', component: ViewReportsComponent },
  { path: 'reports/translated/:lang', component: TranslatedReportsComponent }, // Added translated reports route
  { path: 'archived-reports', component: ViewReportsComponent }, 
  { path: 'delete-reports', component: ViewReportsComponent }, 
  
  // Stats Route
  { path: 'supplier-financial-health', component: SupplierStatsComponent },
  
  // Default Redirect
  { path: '', redirectTo: '/view-reports', pathMatch: 'full' },
  
  // Wildcard Route (should be last)
  { path: '**', redirectTo: '/view-reports' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}