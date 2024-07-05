import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MessagesService} from "../messages/messages.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  form = this.fb.group({
    email: [''],
    password: ['']
  });
  messagesService = inject(MessagesService);
  authService = inject(AuthService);
  router = inject(Router);

  async onLogin() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this.messagesService.showMessage('Please enter email and password', 'error');
        return;
      }
      await this.authService.login(email, password);
      this.messagesService.showMessage('Login successful, redirecting...', 'success');
      setTimeout(() => {
        this.messagesService.clear();
        this.router.navigate(['/']);
      }, 800);

    } catch (e) {
      this.messagesService.showMessage('Login failed, please try again', 'error');
      console.error(e);
    }
  }
}
