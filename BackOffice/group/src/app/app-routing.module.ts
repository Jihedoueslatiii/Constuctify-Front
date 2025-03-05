import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReportsComponent } from './Reports/viewreports/viewreports.component';
import { AddSupplierComponent } from './Views/Supplier/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './Views/Supplier/update-supplier/update-supplier.component';
import { ViewContractsComponent } from './Views/Supplier/view-contracts/view-contracts.component';
import { ViewSupplierComponent } from './Views/Supplier/view-supplier/view-supplier.component';
import { SupplierStatsComponent } from './Views/Supplier/supplier-stats/supplier-stats.component';


const routes: Routes = [
  { path: 'view-supplier', component: ViewSupplierComponent },
  { path: 'add-supplier', component: AddSupplierComponent },
  { path: 'update-supplier/:id', component: UpdateSupplierComponent },
  { path: 'view-contracts', component: ViewContractsComponent },
  { path: 'contract-details/:id', component: ViewContractsComponent },
  { path: 'view-reports', component: ViewReportsComponent },
  { path: 'archived-reports', component: ViewReportsComponent }, 
  { path: 'delete-reports', component: ViewReportsComponent }, 
  // Add the new route for Supplier Financial Health Stats
  { path: 'supplier-financial-health', component: SupplierStatsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}