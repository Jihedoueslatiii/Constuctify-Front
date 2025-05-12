export class Finance {
  financeId!: number;
  cost!: number;
  budget!: number;
  otherExpenses!: number;
  description!: string;
  roi!: number;

  constructor(
    financeId: number,
    cost: number,
    budget: number,
    otherExpenses: number,
    description: string,
    roi: number
  ) {
    this.financeId = financeId;
    this.cost = cost;
    this.budget = budget;
    this.otherExpenses = otherExpenses;
    this.description = description;
    this.roi = roi;
  }
}
