// predictive-analysis.service.ts
import { Injectable } from '@angular/core';
import { Deliverable, DeliverableStatus } from '../../Views/model/deliverable.module';

@Injectable({ providedIn: 'root' })
export class PredictiveAnalysisService {

  calculateProjectHealth(deliverables: Deliverable[]): number {
    const weights = {
      [DeliverableStatus.COMPLETED]: 1,
      [DeliverableStatus.VALIDATED]: 1,
      [DeliverableStatus.IN_PROGRESS]: 0.5,
      [DeliverableStatus.REJECTED]: -0.5
    };

    const score = deliverables.reduce((total, d) => {
      return total + (weights[d.status] || 0);
    }, 0);

    return Math.max(0, (score / deliverables.length) * 100);
  }

  predictDelays(deliverables: Deliverable[]): { delayed: number; riskLevel: 'high'|'medium'|'low' } {
    const now = new Date();
    const delayed = deliverables.filter(d => 
      d.status !== DeliverableStatus.COMPLETED && 
      d.status !== DeliverableStatus.VALIDATED &&
      new Date(d.expected_date) < now
    ).length;

    const ratio = delayed / deliverables.length;
    
    return {
      delayed,
      riskLevel: ratio > 0.3 ? 'high' : ratio > 0.1 ? 'medium' : 'low'
    };
  }

  getCompletionEstimate(deliverables: Deliverable[]): Date {
    const completed = deliverables.filter(d => 
      d.status === DeliverableStatus.COMPLETED || 
      d.status === DeliverableStatus.VALIDATED
    );
    
    const avgCompletionTime = completed.length > 0 ? 
      completed.reduce((sum, d) => {
        const delivery = d.delivery_date ? new Date(d.delivery_date) : new Date();
        return sum + (delivery.getTime() - new Date(d.expected_date).getTime());
      }, 0) / completed.length : 0;

    const pending = deliverables.filter(d => 
      d.status !== DeliverableStatus.COMPLETED && 
      d.status !== DeliverableStatus.VALIDATED
    );

    const lastExpectedDate = new Date(Math.max(...pending.map(d => 
        new Date(d.expected_date).getTime()))); 
    return new Date(lastExpectedDate.getTime() + avgCompletionTime);
  }
}