import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PredictionService } from '../service/prediction.service';

@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrls: ['./predict.component.css']
  
})
export class PredictComponent {
  predictForm: FormGroup;
  predictionResult: number | null = null;

  themes = ['Hospital', 'School', 'Bridge', 'Road'];
  types = ['Infrastructure', 'IT', 'Healthcare'];
  qualities = ['A', 'B', 'C'];
  managerLevels = ['Junior', 'Mid', 'Senior'];

  constructor(private fb: FormBuilder, private predictionService: PredictionService) {
    this.predictForm = this.fb.group({
      project_theme: ['', Validators.required],
      project_type: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      team_size: [0, [Validators.required, Validators.min(1)]],
      contractor_quality: ['', Validators.required],
      project_manager_level: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.predictForm.valid) {
      const formData = this.predictForm.value;
      this.predictionService.getPrediction(formData).subscribe({
        next: (res) => {
          this.predictionResult = res.prediction;
        },
        error: (err) => {
          console.error('Prediction failed:', err);
        }
      });
    }
  }
}
