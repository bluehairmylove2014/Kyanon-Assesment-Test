import { Component, OnInit, Input, SimpleChanges, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-Profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileForm') profileFormRef!: ElementRef;
  @ViewChild('preventWall') preventWallRef!: ElementRef;
  @ViewChild('updateSuccessNoti') updateSuccessNotiRef!: ElementRef;

  isDisabled = true;
  user_id: string = '';
  ud_backupVersion !: any;
  ud_tempVersion = {
    email: "",
    fullname: "",
    dob: "",
    phoneCode: "",
    phone: ""
  }
  phoneCodes = [
    { code: "+1", country: "Hoa Kỳ" },
    { code: "+65", country: "Singapore" },
    { code: "+84", country: "Việt Nam" },
  ];
  
  constructor(
    private auth_service: AuthService,
    private user_service: UserService,
    private renderer: Renderer2
  ) { }
  // Methods
  isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  isValidPhoneNumber(phone_code:string, phone_number: string): boolean {

    let regex = /^[689]\d{7}$/; // Singapore regex (+65)
    if(phone_code === '+84') {
      regex = /^((9|3|7|8|5)+([0-9]{8})\b)$/
    }
    else if(phone_code === '+1') {
      regex = /^\d{10}$/
    }
    return regex.test(phone_number);
  }
  showError(input_id: string) {
    // Get data entry error label
    const de_errors = this.profileFormRef.nativeElement.querySelectorAll('.data-entry-error');

    de_errors && de_errors.forEach((dee:any) => {
      if(dee.id === input_id) {
        this.renderer.addClass(dee, 'active');
        return;
      }
      else {
        this.renderer.removeClass(dee, 'active');
      }
    })
  }
  hideAllError() {
    // Get data entry error label
    const de_errors = this.profileFormRef.nativeElement.querySelectorAll('.data-entry-error');
    de_errors && de_errors.forEach((dee:any) => {
        this.renderer.removeClass(dee, 'active');
    })
  }
  updateDetail(): void {
    // Check valid information
    if(!this.ud_tempVersion.fullname.trim().length) {
      this.showError('fullname-error');
    }
    else if(!this.isValidEmail(this.ud_tempVersion.email)) {
      this.showError('pemail-error');
    }
    else if(!this.isValidPhoneNumber(this.ud_tempVersion.phoneCode, this.ud_tempVersion.phone)) {
      this.showError('phone-error');
    }
    else {
      this.hideAllError();
      // Update
      // Using user_service to set user detail on server
      this.user_service.setUserDetail(this.ud_tempVersion);
      // Update new backup user detail
      this.ud_backupVersion = {...this.ud_tempVersion};
      // Handle animation
      this.renderer.addClass(this.updateSuccessNotiRef.nativeElement, 'active') 
      setTimeout(() => {
        this.renderer.removeClass(this.updateSuccessNotiRef.nativeElement, 'active') 
      }, 2000);
    }
  }
  onCancelClick() {
    // return temp version to backup version
    this.ud_tempVersion = {...this.ud_backupVersion};
  }

  getUserData():void {
    if(this.auth_service.isLogin()) {
      // Get user_id from auth_service
      this.user_id = this.auth_service.getUID();
      this.user_id && this.user_service.getUserDetail(this.user_id)
      .then(user_detail => {
        // Data handle
        this.ud_backupVersion = user_detail;
        this.ud_tempVersion = {...this.ud_backupVersion};
        // Set mark
        this.isDisabled = false;
      })
      .catch(err => {
        alert(err);
      })
    }
  }

  // Hooks
  ngOnInit() {
    this.getUserData();
  }
  ngDoCheck(): void {
    if(this.preventWallRef) {    
      if(this.auth_service.isLogin()) {
        this.isDisabled && this.getUserData();
        const lock = this.preventWallRef.nativeElement.querySelector('.lock');
        lock && this.renderer.setStyle(lock, 'animation-play-state', 'running');
        
        setTimeout(() => {
          this.renderer.setStyle(this.preventWallRef.nativeElement, 'display','none');
        }, 1000);
      }
      else {
        if(!this.isDisabled) {
          this.isDisabled = true
          // Erase data
          this.ud_backupVersion = null;
          this.ud_tempVersion = {
            "email": "",
            "fullname": "",
            "dob": "",
            "phoneCode": "",
            "phone": ""
          }
        }
        const lock = this.preventWallRef.nativeElement.querySelector('.lock');
        lock && this.renderer.setStyle(lock, 'animation-play-state', 'paused');
        this.renderer.setStyle(this.preventWallRef.nativeElement, 'display','flex');
      }
    }
  }
}
