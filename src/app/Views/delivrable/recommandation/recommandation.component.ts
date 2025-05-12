import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import { RecommandationService } from '../../service/recommandation-service.service';

@Component({
  selector: 'app-recommandation',
  templateUrl: './recommandation.component.html',
  styleUrls: ['./recommandation.component.css']
})
export class RecommandationComponent {

  output: string = '';
  loading = false;
  error: string | null = null;
  pdfSuccessMessage: string | null = null;

  constructor(private recoService: RecommandationService) { }

  // Lancer le modèle de recommandation
  runReco() {
    this.loading = true;
    this.error = null;
    this.output = '';

    this.recoService.runRecommendation().subscribe({
      next: (result) => {
        this.output = result;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la génération des recommandations.';
        this.loading = false;
      }
    });
  }

  // Télécharger le résultat en PDF avec logo et mise en forme
  downloadPDF() {
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(16);
  doc.text('Rapport de Recommandations', 70, 20);

  // Ligne de séparation
  doc.setLineWidth(0.5);
  doc.line(10, 25, 200, 25);

  // Contenu des recommandations (formaté pour tenir dans la page)
  const lines = doc.splitTextToSize(this.output, 180);
  doc.setFontSize(12);
  doc.text(lines, 10, 35);

  // Enregistrement du PDF
  doc.save('rapport_recommandations.pdf');

  // Message de confirmation
  this.pdfSuccessMessage = 'PDF téléchargé avec succès !';
}
  }