import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  token: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  submitPassword(): void {
    if (!this.password || !this.confirmPassword) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire('Erreur', 'Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(this.password)) {
      Swal.fire('Erreur', 'Le mot de passe est trop faible', 'error');
      return;
    }

    this.userService.setPassword(this.token, this.password).subscribe({
      next: (res) => {
        Swal.fire('Succès', 'Votre mot de passe a été défini ! Vous pouvez maintenant vous connecter.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Erreur', err.error || 'Une erreur est survenue.', 'error');
      }
    });
  }
}
