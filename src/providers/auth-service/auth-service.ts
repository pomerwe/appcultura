import { Injectable } from "@angular/core";
import { HttpHeaders} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from "../../../node_modules/rxjs/Observable";
import { tap, finalize } from "rxjs/operators";
import { JwtHelper } from 'angular2-jwt';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  private urlLogin : string = 'http://localhost:22001/oauth/token';
  private urlLogout: string = 'http://localhost:22001/oauth/revoke';
  authorization : string;

  constructor(private http:HttpClient){

      this.authorization = 'Basic ' + btoa(`ionic:10n1c0`);

  }
  private jwtHelper = new JwtHelper();
  public getBasicAuthorizationHeader(): HttpHeaders {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', this.authorization);
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
      return headers;
    }

    
public login(acesso: string, senha: string): Observable<any> {
  
  console.log(acesso);
  console.log(senha);
  const headers = this.getBasicAuthorizationHeader();
  const body = `client=ionic&username=${acesso}&password=${senha}&grant_type=password`;
  
  return this.http.post(this.urlLogin,body,{headers, withCredentials:true}).pipe(
    tap(data=>{
      this.isValidAccessToken();
      this.clearAccessToken();
      this.storeAccessToken(data.access_token);


    })
  )
  
}

private storeAccessToken(accessToken: string) {
  localStorage.setItem('access_token', accessToken);
  
 
}


private clearAccessToken() {
  localStorage.removeItem('access_token');
}

public isValidAccessToken() {
  const token = localStorage.getItem('access_token');
  
  if (!token || this.jwtHelper.isTokenExpired(token)) {
    return false;
  }
  
  return true;
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

}