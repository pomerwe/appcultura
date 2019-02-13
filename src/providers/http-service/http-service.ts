import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthServiceProvider } from "../auth-service/auth-service";
import { Observable } from "../../../node_modules/rxjs/Observable";
import { RequestOptionsArgs } from "@angular/http";
import { HTTP } from '@ionic-native/http';

import { environment as env } from "../../environments/environment";
/*
  Generated class for the HttpServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpServiceProvider {

  private urlApi: string;

  constructor(
    private http: HttpClient,
    private auth: AuthServiceProvider
  ) {
    this.urlApi = env.BASE_URL;
  }
  

  public getDiaDia(param):Observable<any>{

    console.log(param);
    let page = param.page;
    let matricula = param.matricula;
    return this.http.get(`${this.urlApi}dia-dia/?matricula=${matricula}&sort=data,desc&page=${page}&size=10&example`);

  }

  public getCodperlet(matricula):Observable<any>{
    let mat = matricula;
    return this.http.get(`${this.urlApi}codperlet/?sort=codperlet,desc&matricula=${mat}&example`);

  }

  public getNotasConceitoList(params):Observable<any>{
    let matricula = params.matricula;
    let codperlet = params.codperlet
    return this.http.get(`${this.urlApi}notas/?matricula=${matricula}&codperlet=${codperlet}&example`);
  }

  public getNotasConceito(id):Observable<any>{
    return this.http.get(`${this.urlApi}notas/${id}`);

  }
  public getAccess(params): Observable<any>{
    
    let senha = params.senha;
    let email = params.email;
    return this.http.get(`${this.urlApi}login?email=${email}&senha=${senha}&example`);
  }

  public getCheckAluno(params) : Observable<any>{
    let matricula = params.id;
    let email = params.email;
    return this.http.get(`${this.urlApi}contas/checkaluno?id=${matricula}&email=${email}&example&sort=nome,asc`);

  }
  public getCheckResp(params) : Observable<any>{
    let matricula = params.id;
    let email = params.email;
    return this.http.get(`${this.urlApi}contas/checkresp?id=${matricula}&email=${email}&example&sort=nome,asc`);

  }
  public getContasVinculo(params) : Observable<any>{
    let matricula = params.id;
    return this.http.get(`${this.urlApi}contas?matricularesp=${matricula}&example&sort=nome,asc`);

  }

  public get( uri: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (params) {
      for (const p in params) {
        if (p && (params[p] === undefined || params[p] === null)) {
          delete params[p];
        }
      }
    }

    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.get(`${this.urlApi}${uri}`, { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.get(`${this.urlApi}${uri}`, { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
      });
  }
  
  public getBlob( uri: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (params) {
      for (const p in params) {
        if (p && (params[p] === undefined || params[p] === null)) {
          delete params[p];
        }
      }
    }

    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.get(`${this.urlApi}${uri}`, { headers: { 'Authorization': `Bearer ${token}` }, params, responseType: 'blob', withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.get(`${this.urlApi}${uri}`, { headers: { 'Authorization': `Bearer ${token}` }, params, responseType: 'blob', withCredentials: true });
      });
  }
  
  public post(uri: string, body: any, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.post(`${this.urlApi}${uri}`
        , body
        , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.post(`${this.urlApi}${uri}`
            , body
            , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
      });
  }

  public postBlob(uri: string, body: any, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.post(`${this.urlApi}${uri}`
        , body
        , { headers: { 'Authorization': `Bearer ${token}` }, params, responseType: 'blob', withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.post(`${this.urlApi}${uri}`
            , body
            , { headers: { 'Authorization': `Bearer ${token}` }, params, responseType: 'blob', withCredentials: true });
      });
  }

//  public patch(uri: string): Observable<any> {
//    const headers = this.auth.getOauthAuthorizationHeader();
//    return this.http.patch(`${this.urlApi}${uri}`, { headers, withCredentials: true });
//  }
//
//  public head(uri: string): Observable<any> {
//    const headers = this.auth.getOauthAuthorizationHeader();
//    return this.http.patch(`${this.urlApi}${uri}`, { headers, withCredentials: true });
//  }
//
//  public options(uri: string): Observable<any> {
//    const headers = this.auth.getOauthAuthorizationHeader();
//    return this.http.patch(`${this.urlApi}${uri}`, { headers, withCredentials: true });
//  }

  public put(uri: string, id: number, body: any, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.put(`${this.urlApi}${uri}/${id}`
        , body
        , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.put(`${this.urlApi}${uri}/${id}`
            , body
            , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
      });
  }

  public delete(uri: string, options?: RequestOptionsArgs): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.delete(`${this.urlApi}${uri}`, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.delete(`${this.urlApi}${uri}`, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true });
      });
  }

}
