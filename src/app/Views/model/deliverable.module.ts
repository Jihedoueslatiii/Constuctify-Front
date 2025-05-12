export enum DeliverableStatus {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    VALIDATED = "VALIDATED",
    REJECTED ="REJECTED"
 
  }

export class Deliverable {
    idDeliverable!: number;
    name!: string;
    expected_date!: Date;
    delivery_date!: Date;
    status!: DeliverableStatus;
  
    constructor(idDeliverable: number, name: string, expected_date: Date, delivery_date: Date, status:DeliverableStatus) {
      this.idDeliverable = idDeliverable;
      this.name = name;
      this.expected_date = expected_date;
      this.delivery_date = delivery_date;
      this.status = status;
    }
}