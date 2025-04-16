import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProblemRiskService, ProblemRisk } from 'src/app/Views/service/problem-risk.service';

@Component({
  selector: 'app-problem-risk-form',
  templateUrl: './problem-risk-form.component.html',
  styleUrls: ['./problem-risk-form.component.css']
})
export class ProblemRiskFormComponent implements OnInit {
  problemRiskForm: FormGroup;
  isEditMode = false;
  problemRiskId: number | null = null; // Stocke l'ID du problème à modifier

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private problemRiskService: ProblemRiskService,
    private fb: FormBuilder
  ) {
    this.problemRiskForm = this.fb.group(
      {
        title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
        type: ['TECHNICAL', Validators.required],
        probability: ['LOW', Validators.required],
        problemStatus: ['OPEN', Validators.required],
        detectionDate: [new Date().toISOString().slice(0, 16), Validators.required],
        appliedSolutions: [''],
        resolutionDate: [null]
      },
      { validators: this.dateOrderValidator }
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.problemRiskId = +id;
      this.loadProblemRiskData(this.problemRiskId);
    }
  }

  loadProblemRiskData(id: number): void {
    this.problemRiskService.getProblemRiskById(id).subscribe({
      next: (data) => {
        this.problemRiskForm.patchValue({
          ...data,
          detectionDate: data.detectionDate ? new Date(data.detectionDate).toISOString().slice(0, 16) : '',
          resolutionDate: data.resolutionDate ? new Date(data.resolutionDate).toISOString().slice(0, 16) : null
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du ProblemRisk :', err);
      }
    });
  }

  /**
   * Génération dynamique à partir d'un problème existant dans la base de données.
   */
  generateData(): void {
    this.problemRiskService.getAllProblemRisks().subscribe({
      next: (problems) => {
        if (problems.length > 0) {
          // Sélectionnez un problème différent ou modifiez la logique de sélection
          const selectedProblem: ProblemRisk = { ...problems[problems.length - 1] }; // Par exemple, sélectionnez le dernier problème
          
          selectedProblem.title = selectedProblem.title + " - Copie";
          
          selectedProblem.detectionDate = new Date();
          selectedProblem.resolutionDate = selectedProblem.resolutionDate ? new Date(selectedProblem.resolutionDate) : undefined;
          selectedProblem.appliedSolutions = "";
  
          this.problemRiskForm.patchValue({
            ...selectedProblem,
            detectionDate: selectedProblem.detectionDate.toISOString().slice(0, 16),
            resolutionDate: selectedProblem.resolutionDate instanceof Date 
              ? selectedProblem.resolutionDate.toISOString().slice(0, 16) 
              : null
          });
        } else {
          console.warn("Aucun problème existant trouvé.");
        }
      },
      error: (err) => console.error("Erreur lors de la récupération des problèmes :", err)
    });
  }
  
  

  save(): void {
    if (this.problemRiskForm.invalid) {
      this.markFormGroupTouched(this.problemRiskForm);
      return;
    }

    const problemRiskData = this.problemRiskForm.value;
    problemRiskData.detectionDate = new Date(problemRiskData.detectionDate).toISOString();
    problemRiskData.resolutionDate = problemRiskData.resolutionDate ? new Date(problemRiskData.resolutionDate).toISOString() : null;

    if (this.isEditMode && this.problemRiskId) {
      this.problemRiskService.updateProblemRisk(this.problemRiskId, problemRiskData).subscribe({
        next: () => this.router.navigate(['/problem-risks']),
        error: (err) => console.error('Erreur lors de la mise à jour :', err)
      });
    } else {
      this.problemRiskService.addProblemRisk(problemRiskData).subscribe({
        next: () => this.router.navigate(['/problem-risks']),
        error: (err) => console.error('Erreur lors de l\'ajout :', err)
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private dateOrderValidator(group: AbstractControl): ValidationErrors | null {
    const detectionDate = group.get('detectionDate')?.value;
    const resolutionDate = group.get('resolutionDate')?.value;

    if (detectionDate && resolutionDate && new Date(resolutionDate) < new Date(detectionDate)) {
      return { dateOrder: true };
    }
    return null;
  }
}
