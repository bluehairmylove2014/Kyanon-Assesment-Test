import { Component, OnInit, Input, SimpleChanges, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-Profile',
  templateUrl: './Profile.component.html',
  styleUrls: ['./Profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() userData: any;
  @ViewChild('profileForm') profileFormRef!: ElementRef;

  isDisabled = true;
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
    this.user_service.setUserDetail(this.ud_tempVersion)
  }
  onPhoneCodeChange() {
    console.log(this.ud_tempVersion.phoneCode);
    
  }
  onCancelClick() {
    this.ud_tempVersion = {...this.userData};
  }


  // Hooks
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes['userData']) {
      this.ud_tempVersion = {...this.userData};
      // dob: (ISO 8601).substring(0, 10)
      // Check login to open editable feature of input
      if(this.isDisabled && this.auth_service.isLogin()) {
        // Get all input and open editable cursor
        const input_list = this.profileFormRef.nativeElement.querySelectorAll('input');
        input_list.forEach((inp: any) => { this.renderer.setStyle(inp, 'cursor', 'auto') })
        // Get select and open editable cursor
        const select_list = this.profileFormRef.nativeElement.querySelectorAll('select');
        select_list.forEach((sl: any) => { this.renderer.setStyle(sl, 'cursor', 'auto') })

        // Set isOpen is true avoid run next time if still signed in
        this.isDisabled = false;
      }
    }
  }

}
