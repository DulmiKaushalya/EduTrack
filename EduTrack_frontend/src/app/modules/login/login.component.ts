import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatCardModule,
		MatIconModule
	]
})
export class LoginComponent {
	loginForm: FormGroup;
	hidePassword = true;
	errorMessage = '';

	constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(4)]]
		});
	}

	onSubmit() {
		if (this.loginForm.invalid) return;
		const { email, password } = this.loginForm.value;
		this.authService.login(email, password).subscribe({
			next: () => {
				this.errorMessage = '';
				this.router.navigate(['/students']);
			},
			error: () => {
				this.errorMessage = 'Invalid credentials';
			}
		});
	}
}
