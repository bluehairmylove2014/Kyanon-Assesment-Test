import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private REST_API_SERVER = 'http://localhost:2014'

    constructor(
        private http: HttpClient
    ) { }

    login(email: string, password: string):Observable<any> {
        return this.http.post(`${this.REST_API_SERVER}/api/v1/auth/login`, {email, password});
    }
    getData(user_id: string):Observable<any> {
        const query = `profile/getData?user_id=${user_id}`
        return this.http.get(`${this.REST_API_SERVER}/api/v1/${query}`);
    }
    // setData(uid: string, fullname: string, dob: string, email: string, phoneCode: string, phone: string):Observable<any> {
    //     return this.http.put(`${this.REST_API_SERVER}/api/v1/profile/setData`, { uid, fullname, dob, email, phoneCode, phone });
    // }
    setData(newUserData: any):Observable<any> {
        return this.http.put(`${this.REST_API_SERVER}/api/v1/profile/setData`, { newUserData });
    }
}
