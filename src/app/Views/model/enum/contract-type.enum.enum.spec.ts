import { ContractType } from "./contract-type.enum.enum";

describe('ContractTypeEnum', () => {
  it('should have the correct enum values', () => {
    expect(ContractType.FIXED_PRICE).toBe('FIXED_PRICE');
    expect(ContractType.TIME_AND_MATERIAL).toBe('TIME_AND_MATERIAL');
    expect(ContractType.RETAINER).toBe('RETAINER');
  });
});
