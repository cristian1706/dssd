import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BonitaService {

  private baseUrl: 'http://localhost:8080/bonita/';
  private token: string;
  constructor(private http: HttpClient) { }

  login(): Observable<any> {
    const headers = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded'});
    return this.http.post(this.baseUrl + 'loginservice', {username: 'walter.bates', password: 'bpm', redirect: false}, {headers});
  }

  // lista de procesos
  processList(token: string): Observable<any> {
    this.token = token;
    const headers = new HttpHeaders({'X-Bonita-API-Token': this.token});
    return this.http.get(this.baseUrl + 'API/bpm/process?p=0&c=1000', {headers});
  }

  // iniciar un proceso
  initProcess(idProcess: number): Observable<any> {
    const headers = new HttpHeaders({'X-Bonita-API-Token': this.token});
    return this.http.post(this.baseUrl + `API/bpm/process/${idProcess}/instantiation`, {headers});
  }

  // setear variables a un caso
  setVariables(caseId: number, variableName: string): Observable<any> {
    const headers = new HttpHeaders({'X-Bonita-API-Token': this.token});
    return this.http.put(`${this.baseUrl}API/bpm/caseVariable/${caseId}/${variableName}`, {headers});
  }

  // logout
  logout(): Observable<any> {
    return this.http.get(`${this.baseUrl}logoutservice?redirect=false`);
  }
}
