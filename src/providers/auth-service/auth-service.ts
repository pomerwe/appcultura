import {catchError, tap, finalize} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { UtilServiceProvider } from '../util-service/util-service';
import { _throw as observableThrowError} from 'rxjs/observable/throw';
export interface User {
    id: number;
    username: string;
    authorities: string[];
    role: string;
    idRole: number;
    name: string;
    nickname: string;
    language: string;
    sector: string;
    location: string;
    photo: string;
    photoUri: string;
}

@Injectable()
export class AuthServiceProvider {

  private urlLogin: string;
  private urlLogout: string;
  private urlRemember: string;
  private authorization: string;
  private user: User;

  constructor(
    private http: HttpClient,
   
    private util: UtilServiceProvider
  ) {
    this.jwtHelper = new JwtHelperService(),
    this.urlLogin = `${environment.urlApi}${environment.uriLogin}`;
    this.urlLogout = `${environment.urlApi}${environment.uriLogout}`;
    this.urlRemember = `${environment.urlApi}${environment.uriRemember}`;
    this.authorization = 'Basic ' + btoa(`${environment.username}:${environment.password}`);
  }

  jwtHelper;

  getUser(): User {
    if (!this.user && this.jwtHelper && localStorage.getItem('access_token')) {
      this.user = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    }
    
    if (this.user) {
        this.user.photoUri = this.util.getFoto(this.user.photo);
    }

    return this.user;
  }

  // changeLanguage() {
  //   if (!this.getUser() || !this.getUser().language) { return; }

  //   this.refreshAccessToken().subscribe(
  //     () => this.translate.use(this.getUser().language.toLowerCase())
  //   );
  // }

  public login(credentials): Observable<any> {
    let acesso: string = credentials.email;
    let senha: string = credentials.senha;
    if (this.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');

      this.http.delete(this.urlLogout, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true }).pipe(
        tap(
          () => {
            this.clearAccessToken();
            return this.login(credentials);
          }
        ));
    }

    const headers = this.getBasicAuthorizationHeader();
    const body = `username=${acesso}&password=${senha}&grant_type=password`;

    return this.http.post<{ access_token: string; }>(this.urlLogin, body, { headers: headers, withCredentials: true }).pipe(
      tap(data => {
        this.clearAccessToken();
        this.storeAccessToken(data.access_token);
        // this.changeLanguage();
      }),
      catchError((response: HttpErrorResponse) => {
        if (response.status === 400 && response.error.error === 'invalid_grant') {
          return observableThrowError(response);
        }

        return observableThrowError(response.error);
      }));
  }

  public logout(): Observable<any> {
    if (this.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.delete(this.urlLogout, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true }).pipe(
        finalize(() => this.clearAccessToken()));
    } else {
      return this.refreshAccessToken().pipe(
        tap(() => {
          const token = localStorage.getItem('access_token');
          return this.http.delete(this.urlLogout, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true });
        }),
        finalize(() => this.clearAccessToken())
      );
    }
  }

  public remember(email: string): Observable<any> {
    return this.http.post(this.urlRemember, email, { withCredentials: true });
  }

  public getBasicAuthorizationHeader(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', this.authorization);
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return headers;
  }

  public isValidAccessToken() {
    const token = localStorage.getItem('access_token');

    if (!token || this.jwtHelper.isTokenExpired(token)) {
      return false;
    }

    return true;
  }

  public refreshAccessToken(): Observable<any> {
    const headers = this.getBasicAuthorizationHeader();
    const body = 'grant_type=refresh_token';
    return this.http.post<{ access_token: string; }>(this.urlLogin, body, { headers, withCredentials: true }).pipe(
      tap(
        response => {
          const token = response.access_token;
          this.storeAccessToken(token);
          return true;
        }));
  }

  public hasAnyRole(roles): boolean {
    for (const role of roles) {
      if (this.hasRole(role)) {
        return true;
      }
    }

    return false;
  }

  public verifyRecaptcha(token: string): Observable<any> {
    return this.http.get(`${environment.urlApi}/recaptcha/${token}`);
  }

  public hasRole(role): boolean {
    if(this.getUser() && this.getUser().authorities){
      for(let a of this.getUser().authorities){
        if(a.match(role) !== null){
          return true;
        }
      }
      return false;
    }
    else{
      return false;
    }
    
  }

  private storeAccessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
    this.user = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
  }

  private clearAccessToken() {
    this.user = null;
    localStorage.removeItem('access_token');
  }

}
