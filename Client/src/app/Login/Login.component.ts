import { Component, ElementRef, OnInit, Renderer2, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-Login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('pswLogin') pswLoginRef!: ElementRef;
  @ViewChild('wrongMsg') wrongMsgRef!: ElementRef;
  @ViewChild('bus') busRef!: ElementRef;
  @ViewChild('airplane') airplaneRef!: ElementRef;
  @ViewChild('sliderHolder') sliderHolderRef!: ElementRef;
  @ViewChild('lf') lfRef!: ElementRef;
  @ViewChild('logoutHolder') logoutHolderRef!: ElementRef;

  showPswStatus: boolean = false;
  isLogin: boolean = false;
  isFirstLoad: boolean = true;
  // Create login form by using Reactive Form Module to handle logical event
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth_service: AuthService,
    private renderer: Renderer2
  ) { }

  // Methods
  showErrorNoti(idnoti: string):void {
    // Get noti
    const wrong_enoti = this.wrongMsgRef.nativeElement.querySelector(`#${idnoti}`);
    if(wrong_enoti) {
      // Display noti ( display: none => display: block )
      this.renderer.setStyle(wrong_enoti, 'display', 'block');
      // Show error noti ( visibility: visible )
      this.renderer.addClass(wrong_enoti, 'active');
      // Undisplay noti after 3s
      setTimeout(() => {
        this.renderer.removeClass(wrong_enoti, 'active');
        this.renderer.setStyle(wrong_enoti, 'display', 'none');
      }, 3000);
    }
  }
  transitionToSignout():void {
    this.isFirstLoad = false;
    this.isLogin = true;
    setTimeout(() => {
      // Turnoff slider and bus
      this.renderer.addClass(this.busRef.nativeElement, 'unvisible');
      const img_slider = this.sliderHolderRef.nativeElement.querySelectorAll('.slider');
      img_slider && img_slider.forEach((imgs:any) => {
        this.renderer.addClass(imgs, 'unvisible');
      })
    }, 2000);
  }
  transitionToSignin(): void {
    // Turnon slider and bus
    this.isFirstLoad = false;
    this.renderer.removeClass(this.busRef.nativeElement, 'unvisible');

    const img_slider = this.sliderHolderRef.nativeElement.querySelectorAll('.slider');
    img_slider && img_slider.forEach((imgs:any) => {
      this.renderer.removeClass(imgs, 'unvisible');
    })
    
    this.isLogin = false;
  }
  signin(): void {
    // Get errors
    const email_errors = this.loginForm.controls['email'].errors;
    const psw_errors = this.loginForm.controls['password'].errors;
    
    // Check valid
    if((email_errors && email_errors['required']) || (psw_errors && psw_errors['required'])) {
      // empty error
      this.showErrorNoti('enoti-empty');
      return;
    }
    else if(email_errors && email_errors['email']) {
      // email is not valid
      this.showErrorNoti('enoti-email-invalid');
      return;
    }
    else if(psw_errors && psw_errors['minlength']) {
      // password is less than 6 character
      this.showErrorNoti('enoti-psw-short');
      return;
    }

    // No error
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    // login process
    this.auth_service.login(email, password)
    .then(result => {
      result.status && this.transitionToSignout();
    })
    .catch(err => {
      console.log('Login-line:101 err::: ', err);
      this.showErrorNoti('enoti-wrong');
    })
  }
  signout(): void {
    this.auth_service.logout();
    setTimeout(() => {
      this.transitionToSignin();
    }, 200);
  }
  showPassword(): void {
    if(this.loginForm.value.showPswStatus) {
      this.renderer.setAttribute(this.pswLoginRef.nativeElement, 'type', 'text');
    }
    else {
      this.renderer.setAttribute(this.pswLoginRef.nativeElement, 'type', 'password');
    }
  }

  // Hooks

  ngOnInit() {
    // Init login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      showPswStatus: false
    })
    // Append is login
    this.isLogin = this.auth_service.isLogin();
  }
}
