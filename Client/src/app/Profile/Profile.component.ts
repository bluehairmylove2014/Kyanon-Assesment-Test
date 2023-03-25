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

  isDisabled = true;
  user_id: string = '';
  ud_backupVersion !: any;
  ud_tempVersion = {
    "email": "",
    "fullname": "",
    "dob": "",
    "phoneCode": "",
    "phone": ""
  }
  phoneCodes = [
    { code: "+1", country: "Hoa Kỳ" },
    { code: "+86", country: "Trung Quốc" },
    { code: "+91", country: "Ấn Độ" },
    { code: "+81", country: "Nhật Bản" },
    { code: "+44", country: "Vương quốc Anh" },
    { code: "+49", country: "Đức" },
    { code: "+33", country: "Pháp" },
    { code: "+39", country: "Ý" },
    { code: "+7", country: "Nga" },
    { code: "+90", country: "Thổ Nhĩ Kỳ" },
    { code: "+55", country: "Braxin" },
    { code: "+52", country: "Mexico" },
    { code: "+65", country: "Singapore" },
    { code: "+60", country: "Malaysia" },
    { code: "+852", country: "Hồng Kông" },
    { code: "+886", country: "Đài Loan" },
    { code: "+82", country: "Hàn Quốc" },
    { code: "+84", country: "Việt Nam" },
    { code: "+66", country: "Thái Lan" }
  ];
  
  constructor(
    private auth_service: AuthService,
    private user_service: UserService,
    private renderer: Renderer2
  ) { }
  // Methods
  updateDetail() {
    // Using user_service to set user detail on server
    this.user_service.setUserDetail(this.ud_tempVersion);
    // Update new backup user detail
    this.ud_backupVersion = {...this.ud_tempVersion};
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
