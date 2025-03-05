import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/url/url';  // Import the Urls class
import { Contract } from '../model/contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private contractsUrl: string = `${Urls.serverpath1}/contracts`; // Base URL from Urls class

  constructor(private http: HttpClient) {}

  // Fetch all contracts
  getAllContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.contractsUrl}/all`);
  }

  // Fetch contract by ID
  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.contractsUrl}/${id}`);
  }

  // Create a new contract
  createContract(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(`${this.contractsUrl}`, contract);
  }

  // Update a contract by ID
  updateContract(id: number, contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(`${this.contractsUrl}/${id}`, contract);
  }

  // Delete a contract by ID
  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.contractsUrl}/${id}`);
  }
}
