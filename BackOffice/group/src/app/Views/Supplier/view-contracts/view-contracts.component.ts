import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Import Router
import { Contract } from '../../model/contract.model';
import { ContractService } from '../../service/contract.service';

@Component({
  selector: 'app-view-contracts',
  templateUrl: './view-contracts.component.html',
  styleUrls: ['./view-contracts.component.css']
})
export class ViewContractsComponent implements OnInit {
  contracts: Contract[] = [];  // Store contracts here
  errorMessage: string = '';   // To handle error messages, if any

  constructor(
    private contractService: ContractService,  // Service to fetch contracts
    private router: Router  // Inject the Router here
  ) {}

  ngOnInit(): void {
    this.loadContracts();  // Load contracts when the component initializes
  }

  loadContracts(): void {
    this.contractService.getAllContracts().subscribe(
      (data) => {
        this.contracts = data;  // Store the fetched contracts in the array
      },
      (error) => {
        this.errorMessage = 'Error fetching contracts!'; // Handle error if API call fails
        console.error('Error fetching contracts:', error);
      }
    );
  }

  viewContractDetails(contractId: number): void {
    this.router.navigate(['/contract', contractId]);  // Navigate to the contract details page
  }
}
