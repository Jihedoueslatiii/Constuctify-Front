// src/app/model/contract.model.ts

import { ContractStatus } from "./enum/contract-status.enum.enum";
import { ContractType } from "./enum/contract-type.enum.enum";
import { Supplier } from "./supplier.module";

export class Contract {
    idContract!: number;
    contractName!: string;
    startDate!: Date;
    endDate!: Date;
    contractValue!: number;
    lastUpdated!: Date;
    notes!: string;
    autoRenewal!: boolean;
    penaltyFee!: number;
    currency!: string;
    renewalDate!: Date;
    archived!: boolean;
    contractStatus!: ContractStatus;
    contractType!: ContractType;
    contractDocuments!: string[];
    supplier!: Supplier;
  

  constructor() {
    this.contractDocuments = [];
  }
}
