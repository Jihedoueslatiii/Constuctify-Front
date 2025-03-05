import { Pipe, PipeTransform } from '@angular/core';
import { Contract } from './contract.model';

@Pipe({
  name: 'filterStatus'
})
export class FilterStatusPipe implements PipeTransform {

  transform(contracts: Contract[], status: string): Contract[] {
    return contracts.filter(contract => contract.contractStatus === status);
  }

}

