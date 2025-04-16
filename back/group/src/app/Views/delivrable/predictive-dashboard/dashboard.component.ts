// dashboard.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Deliverable } from '../../../../app/Views/model/deliverable.module';
import { PredictiveAnalysisService } from '../../../../app/Views/service/predictive-analysis.service';

@Component({
  selector: 'app-predictive-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @Input() deliverables: Deliverable[] = [];
  
  healthScore: number = 0;
  delayRisk: { delayed: number; riskLevel: string } = { delayed: 0, riskLevel: 'low' };
  estimatedCompletion?: Date;

  constructor(private predictiveService: PredictiveAnalysisService) {}

  ngOnInit(): void {
    this.analyzeData();
  }

  analyzeData(): void {
    this.healthScore = this.predictiveService.calculateProjectHealth(this.deliverables);
    this.delayRisk = this.predictiveService.predictDelays(this.deliverables);
    this.estimatedCompletion = this.predictiveService.getCompletionEstimate(this.deliverables);
  }
}