import { Component, ElementRef, OnInit, Renderer2, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('errorLogin') errorLoginRef!: ElementRef;
  @ViewChild('pswLogin') pswLoginRef!: ElementRef;
  @Output() userDetailPublisher = new EventEmitter<any>();
  showPswStatus: boolean = false;
  // Create login form by using Reactive Form Module to handle logical event
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth_service: AuthService,
    private user_service: UserService,
    private renderer: Renderer2
  ) { 
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      showPswStatus: false
    })
  }

  // Methods
  signin() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.auth_service.login(email, password)
    .then(result => {
        // Hide error noti 
        
        this.renderer.removeClass(this.errorLoginRef.nativeElement, 'active');
        // Get user data
        result.userid && this.user_service.getUserDetail(result.userid)
        .then(user_detail => {
          // Push data to profile
          this.userDetailPublisher.emit(user_detail);
        })
        .catch(err => {
          alert(err);
        })
    })
    .catch(err => {
      // show error noti
      this.renderer.addClass(this.errorLoginRef.nativeElement, 'active');
      this.renderer.setProperty(this.errorLoginRef.nativeElement, 'innerHTML', err.msg);
    })
  }
  showPassword() {
    if(this.loginForm.value.showPswStatus) {
      this.renderer.setAttribute(this.pswLoginRef.nativeElement, 'type', 'text');
    }
    else {
      this.renderer.setAttribute(this.pswLoginRef.nativeElement, 'type', 'password');
    }
  }

  // Hooks

  ngOnInit() {
  }

  ngOnDestroy(): void {
    
    this.auth_service.logout();
  }

}
