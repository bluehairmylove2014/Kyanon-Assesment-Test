import { Component } from '@angular/core';

// Import sub-component
import { LoginComponent } from './Login/Login.component';
import { ProfileComponent } from './Profile/Profile.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Kyanon Login';
  userDetail = {
    "email": "",
    "fullname": "",
    "dob": "",
    "phoneCode": "",
    "phone": ""
  }
  updateUserDetail(detail: any) {
    this.userDetail = detail;
  }
}
