import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private api: ApiService
    ) { }

    getUserDetail(userid: string):Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.api.getData(userid).subscribe((res: any) => {resolve(res);})
            }
            catch(err) {
                reject(err);
            }
        })
    }
    setUserDetail(data: any):Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.api.setData(data).subscribe((res: any) => {resolve(res);})
            }
            catch(err) {
                reject(err);
            }
        })
    }

}
