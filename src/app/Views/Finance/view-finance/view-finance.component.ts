import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../../service/finance.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-finance',
  templateUrl: './view-finance.component.html',
  styleUrls: ['./view-finance.component.css']
})
export class ViewFinanceComponent implements OnInit {
  listFinance: { financeId: number, cost: number, budget: number, otherExpenses: number, description: string, roi: number ,valider?: number}[] = [];
  totalROI: number = 0;
  totalcost: number = 0;
  page: number = 1; // Page actuelle pour la pagination
  numeroTelephone: string = '';

  constructor(private rs: FinanceService, private router: Router) {}

  ngOnInit(): void {
    this.loadFinances();
  }

  loadFinances(): void {
    this.rs.getFinance().subscribe({
      next: (res) => this.listFinance = res,
      error: (err) => console.error('Erreur de récupération des Finance:', err)
    });
  }

  deleteFinances(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette ressource ?")) {
      this.rs.deleteFinance(id).subscribe({
        next: () => {
          this.listFinance = this.listFinance.filter(res => res.financeId !== id);
        },
        error: (err) => console.error('Erreur lors de la suppression de la ressource:', err)
      });
    }
  }

  calculateTotalROI(): void {
    this.rs.calculateAndUpdateTotalROI().subscribe({
      next: (roi) => {
        this.totalROI = roi;
        this.loadFinances();
      },
      error: (err) => console.error('Erreur lors du calcul du ROI:', err)
    });
  }

  calculateTotalCost(): void {
    this.rs.calculatecost().subscribe({
      next: (cost) => {
        this.totalcost = cost;
        this.loadFinances();
      },
      error: (err) => console.error('Erreur lors du calcul du coût total:', err)
    });
  }
  

  exportAsExcel(): void {
    // Préparer les données pour Excel
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listFinance);

    // Définir des styles personnalisés pour les en-têtes et les données
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
      fill: { fgColor: { rgb: "4B8A8D" } },  // Couleur de fond pour les en-têtes (bleu-vert foncé)
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: 'thin', color: { rgb: "000000" } },
        bottom: { style: 'thin', color: { rgb: "000000" } },
        left: { style: 'thin', color: { rgb: "000000" } },
        right: { style: 'thin', color: { rgb: "000000" } }
      }
    };

    // Appliquer le style aux en-têtes manuellement
    const columns = Object.keys(this.listFinance[0]);
    for (let col = 0; col < columns.length; col++) {
      const headerCell = ws[XLSX.utils.encode_cell({ r: 0, c: col })];
      if (headerCell) {
        headerCell.s = headerStyle;
      }
    }

    // Appliquer un style aux cellules de données
    for (let row = 1; row < this.listFinance.length + 1; row++) {
      for (let col = 0; col < columns.length; col++) {
        const dataCell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
        if (dataCell) {
          dataCell.s = {
            font: { sz: 11, color: { rgb: "333333" } },  // Texte gris foncé pour les données
            border: {
              top: { style: 'thin', color: { rgb: "000000" } },
              bottom: { style: 'thin', color: { rgb: "000000" } },
              left: { style: 'thin', color: { rgb: "000000" } },
              right: { style: 'thin', color: { rgb: "000000" } }
            },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "F4F4F9" } }  // Couleur de fond pour les cellules de données (gris clair)
          };
        }
      }
    }

    // Ajouter une ligne pour les totaux
    const totalRow = [
      'Total',
      this.totalcost, 
    
    ];

    // Ajouter cette ligne à la fin du tableau
    XLSX.utils.sheet_add_aoa(ws, [totalRow], { origin: -1 });

    // Appliquer un style spécial à la ligne des totaux
    const lastRow = this.listFinance.length + 1;  // La dernière ligne des données
    for (let col = 0; col < totalRow.length; col++) {
      const cell = ws[XLSX.utils.encode_cell({ r: lastRow, c: col })];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
          fill: { fgColor: { rgb: "3498DB" } },  // Couleur de fond pour la ligne Totaux (bleu vif)
          border: {
            top: { style: 'thin', color: { rgb: "000000" } },
            bottom: { style: 'thin', color: { rgb: "000000" } },
            left: { style: 'thin', color: { rgb: "000000" } },
            right: { style: 'thin', color: { rgb: "000000" } }
          },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    }

    // Créer un classeur avec une feuille
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Budgets");

    // Exporter le fichier Excel
    XLSX.writeFile(wb, "Liste_Budget_Design.xlsx");
}

// Ajoutez cette propriété pour le feedback utilisateur
smsSent: boolean = false;
smsError: string = '';

// Modifiez la méthode sendAlertSms()
sendAlertSms(): void {
  if (!this.numeroTelephone.trim()) {
    this.smsError = 'Veuillez entrer un numéro de téléphone valide';
    setTimeout(() => this.smsError = '', 3000);
    return;
  }

  // Validation simple du numéro de téléphone
  if (!this.validatePhoneNumber(this.numeroTelephone)) {
    this.smsError = 'Format de numéro invalide. Ex: +21612345678';
    setTimeout(() => this.smsError = '', 3000);
    return;
  }

  this.rs.sendSmsAlert(this.numeroTelephone).subscribe({
    next: (response) => {
      this.smsSent = true;
      setTimeout(() => this.smsSent = false, 3000);
      console.log('SMS envoyé:', response);
    },
    error: (err) => {
      this.smsError = 'Erreur lors de l\'envoi du SMS';
      setTimeout(() => this.smsError = '', 3000);
      console.error('Erreur SMS:', err);
    }
  });
}

// Méthode de validation du numéro de téléphone
validatePhoneNumber(phone: string): boolean {
  const regex = /^\+?\d{8,15}$/; // Accepte +216... ou juste les chiffres
  return regex.test(phone);
}

}