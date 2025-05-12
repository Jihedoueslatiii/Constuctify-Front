import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Report } from 'src/app/Views/model/report.module';
import { ReportsService } from 'src/app/Views/service/Supplier/reports.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface LanguageOption {
  code: string;
  name: string;
}

@Component({
  selector: 'app-translated-reports',
  templateUrl: './translated-reports.component.html',
  styleUrls: ['./translated-reports.component.css']
})
export class TranslatedReportsComponent implements OnInit {
  reports: Report[] = [];
  currentLanguage = 'en';
  availableLanguages: LanguageOption[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' }
  ];
  isLoading = true;
  fallbackLanguage = 'en';

  constructor(
    private reportsService: ReportsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentLanguage = params['lang'] || this.fallbackLanguage;
      this.loadTranslatedReports();
    });
  }

  loadTranslatedReports(): void {
    this.isLoading = true;
    this.reportsService.getTranslatedReports(this.currentLanguage).subscribe({
      next: (reports) => {
        this.reports = reports?.filter(r => r != null) || [];
        if (this.reports.length === 0 && this.currentLanguage !== this.fallbackLanguage) {
          this.loadFallbackReports();
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading translated reports:', error);
        this.loadFallbackReports();
      }
    });
  }

  private loadFallbackReports(): void {
    this.reportsService.getTranslatedReports(this.fallbackLanguage).subscribe({
      next: (reports) => {
        this.reports = reports?.filter(r => r != null) || [];
        this.isLoading = false;
        if (this.currentLanguage !== this.fallbackLanguage) {
          this.snackBar.open(
            `Showing reports in English (no translations available for ${this.getLanguageName(this.currentLanguage)})`,
            'Close',
            { duration: 5000 }
          );
        }
      },
      error: (error) => {
        console.error('Error loading fallback reports:', error);
        this.reports = [];
        this.isLoading = false;
        this.snackBar.open('Error loading reports', 'Close', { duration: 3000 });
      }
    });
  }

  changeLanguage(langCode: string): void {
    this.currentLanguage = langCode;
    this.router.navigate(['reports/translated', langCode]);
  }

  getLanguageName(code: string): string {
    const lang = this.availableLanguages.find(l => l.code === code);
    return lang ? lang.name : code.toUpperCase();
  }
}