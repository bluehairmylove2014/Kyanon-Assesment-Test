import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import * as moment from 'moment';
import jwt_decode from 'jwt-decode';
import * as scrypt from 'scrypt-async';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private idtoken_keyword = 'id_token';
  private expires_keyword = 'expires_at';
  private userid_keyword = 'userid';

  private decode_package: any;

  // Config Scrypt-async
  scrypt_async = {
    salt: 'mySalt',
    logN: 14,
    r: 8,
    dkLen: 32
  }

  constructor(
    private api: ApiService,
  ) { }

  login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Encode password
      let encodePsw:string = '';
      scrypt(
        password, 
        this.scrypt_async.salt, 
        this.scrypt_async.logN, 
        this.scrypt_async.r, 
        this.scrypt_async.dkLen, 
      (derivedKey) => {
        encodePsw = Array.isArray(derivedKey) ? derivedKey.map(n => n.toString(16).padStart(2, '0')).join('') : derivedKey.toString();

        this.api.login(email, encodePsw).subscribe(
          (res: any) => {
            if (res !== 'invalid') {
              const expiresAt = moment().add(res.expiresIn, 'minute');
  
              // Decode to get userid
              let userid;
              res.idToken && (this.decode_package = jwt_decode(res.idToken));
              this.decode_package.sub && (userid = this.decode_package.sub);
  
              localStorage.setItem(this.userid_keyword, userid);
              localStorage.setItem(this.idtoken_keyword, res.idToken);
              localStorage.setItem(this.expires_keyword, JSON.stringify(expiresAt.valueOf()));
  
              resolve({ status: true, userid: userid, msg: 'Login successfully' });
            }
            else {
              reject({ status: false, userid: null, msg: 'Wrong email or password!' });
            }
          }
        )
      });
    })
  }
  logout(): void {
    localStorage.removeItem(this.idtoken_keyword);
    localStorage.removeItem(this.expires_keyword);
    localStorage.removeItem(this.userid_keyword);
  }
  isLogin(): boolean {
    const str = localStorage.getItem(this.expires_keyword) || "";
    if (str == "") return false;
    const expiresAt = JSON.parse(str);
    return moment().isBefore(moment(expiresAt));
  }
  setUsername(new_usn: string): void {
    localStorage.setItem(this.userid_keyword, new_usn);
  }
  getUsername(): string {
    let username = localStorage.getItem(this.userid_keyword);
    return username ? username : '';
  }
}
