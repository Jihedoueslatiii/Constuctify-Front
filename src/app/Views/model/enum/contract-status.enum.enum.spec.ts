import { ContractStatus } from "./contract-status.enum.enum";

describe('ContractStatusEnum', () => {
  it('should have the correct enum values', () => {
    expect(ContractStatus.ACTIVE).toBe('ACTIVE');
    expect(ContractStatus.COMPLETED).toBe('COMPLETED');
    expect(ContractStatus.TERMINATED).toBe('TERMINATED');
    expect(ContractStatus.PENDING).toBe('PENDING');
    expect(ContractStatus.CANCELLED).toBe('CANCELLED');
  });
});
