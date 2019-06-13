import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "../../../node_modules/rxjs/Observable";
import { RequestOptionsArgs } from "@angular/http";

import { environment as env } from "../../environments/environment";
import { AuthServiceProvider } from "../auth-service/auth-service";
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
    this.urlApi = env.BASE_URL + env.urnApi;
  }
  

  //Get criado pra realizar requisições em urns fora de MOVEL
  public specialGet(url, urn: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (params) {
      for (const p in params) {
        if (p && (params[p] === undefined || params[p] === null)) {
          delete params[p];
        }
      }
    }

    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.get(`${url}${urn}`, { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.get(`${url}${urn}`, { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
      });
  }
  //Post criado pra realizar requisições em urns fora de MOVEL
  public specialPost(url: string, urn: string, body: any, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.post(`${url}${urn}`
        , body
        , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.post(`${url}${urn}`
            , body
            , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
      });
  }
  //Requisição que não requer token e pode ir além da urn movel
  public noTokenSpecialPost(url: string, urn: string, body: any, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
   
      return this.http.post(`${url}${urn == undefined ? "" : urn}`
        , body
        , {  headers: { 'Access-Control-Allow-Origin': `*`,"Access-Control-Allow-Headers": "Content-Length" },params});
    
  }
  public noTokenSpecialGet(url: string, urn?: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
   
    return this.http.get(`${url}${urn == undefined ? "" : urn}`
      , {headers: { 'Access-Control-Allow-Origin': `*`,"Access-Control-Allow-Headers": "Content-Length" }, params});
  
}
  public get( urn: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (params) {
      for (const p in params) {
        if (p && (params[p] === undefined || params[p] === null)) {
          delete params[p];
        }
      }
    }

    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.get(`${this.urlApi}${urn}`, { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.get(`${this.urlApi}${urn}`, { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
      });
  }
  
  public getBlob( urn: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (params) {
      for (const p in params) {
        if (p && (params[p] === undefined || params[p] === null)) {
          delete params[p];
        }
      }
    }

    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.get(`${this.urlApi}${urn}`, { headers: { 'Authorization': `Bearer ${token}` }, params, responseType: 'blob', withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.get(`${this.urlApi}${urn}`, { headers: { 'Authorization': `Bearer ${token}` }, params, responseType: 'blob', withCredentials: true });
      });
  }
  
  public post(urn: string, body: any, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.post(`${this.urlApi}${urn}`
        , body
        , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.post(`${this.urlApi}${urn}`
            , body
            , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
      });
  }

  public postBlob(urn: string, body: any, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.post(`${this.urlApi}${urn}`
        , body
        , { headers: { 'Authorization': `Bearer ${token}` }, params, responseType: 'blob', withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.post(`${this.urlApi}${urn}`
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

  public put(urn: string, id: number, body: any, params?: HttpParams | { [param: string]: string | string[] }): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.put(`${this.urlApi}${urn}/${id}`
        , body
        , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.put(`${this.urlApi}${urn}/${id}`
            , body
            , { headers: { 'Authorization': `Bearer ${token}` }, params, withCredentials: true });
      });
  }

  public delete(urn: string, options?: RequestOptionsArgs): Observable<any> {
    if (this.auth.isValidAccessToken()) {
      const token = localStorage.getItem('access_token');
      return this.http.delete(`${this.urlApi}${urn}`, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true });
    }
    
    return this.auth.refreshAccessToken()
      .flatMap(() => {
        const token = localStorage.getItem('access_token');
        return this.http.delete(`${this.urlApi}${urn}`, { headers: { 'Authorization': `Bearer ${token}` }, withCredentials: true });
      });
  }

}
