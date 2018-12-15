import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BonitaService {

  private token: string;
  constructor(private http: HttpClient) { }

  login(): any {
    let body = new URLSearchParams();
    body.set('username', 'walter.bates');
    body.set('password', 'bpm');
    body.set('redirect', 'false');
    return this.http.post('http://localhost:8080/bonita/loginservice', body.toString(), {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
      observe: 'response',
      withCredentials: true})
  }
  
  // lista de procesos
  getProcess(token: string): any {
    this.token = token;
    return this.http.get('http://localhost:8080/bonita/API/bpm/process?s=Proceso', {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'}),
      observe: 'response',
      withCredentials: true
    });
  }

  // iniciar un proceso
  initProcess(idProcess: number,idProduct: number, idUser: number, idCoupon: number): Observable<any> {
/*     let body = {
      "idProducto": idProduct,
      "idUsuario": idUser,
      "idCupon": idCoupon
    }; */
/*     let data = JSON.stringify(body); */
    return this.http.post(`http://localhost:8080/bonita/API/bpm/process/${idProcess}/instantiation`,{body:JSON.stringify({"idProducto": idProduct,
    "idUsuario": idUser,
    "idCupon": idCoupon})}, {
      headers: new HttpHeaders({'Content-Type': 'application/json',
      'X-Bonita-API-Token': this.token}),
      observe: 'response',
      withCredentials: true
    });
  }

  startCase(processId: number, productId:number, couponId: number, userId:number): any {
    
    return this.http.post(`http://localhost:8080/bonita/API/bpm/case`,
    {"processDefinitionId": processId, "variables": [{"name": "idProducto", "value": productId},
  {"name": "idCupon", "value": couponId},{"name": "idUsuario", "value": userId}]},
    {
      headers: new HttpHeaders({'Content-Type': 'application/json',
      'X-Bonita-API-Token': this.token}),
      observe: 'response',
      withCredentials: true
    });
  }

  // setear variables a un caso
  setVariables(caseId: number, variableName: string): any {
    return this.http.put(`http://localhost:8080/bonita/API/bpm/caseVariable/${caseId}/${variableName}`,{type: "java.lang.Integer",
  value: 10}, {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
      'X-Bonita-API-Token': this.token}),
      observe: 'response',
      withCredentials: true
    });
  }

  //retorna las variables del caso caseId
  checkCaseVariables(caseId: number): any {
    return this.http.get(`http://localhost:8080/bonita/API/bpm/caseVariable?p=0&c=10&f=case_id=${caseId}`, {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
      'X-Bonita-API-Token': this.token}),
      observe: 'response',
      withCredentials: true
    });
  }

  checkProcess(caseId: number): any {
    return this.http.get(`http://localhost:8080/bonita/API/bpm/case/${caseId}`, {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
      'X-Bonita-API-Token': this.token}),
      observe: 'response',
      withCredentials: true
    });
  }

  checkTasks(idProcess: number) {
    return this.http.get(`http://localhost:8080/bonita/API/bpm/task?c=10&p=0&f=processId=${idProcess}&o=state`,{
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
      'X-Bonita-API-Token': this.token}),
      observe: 'response',
      withCredentials: true
    });
  }

  getHumanTask(idTask: number): any {
    return this.http.get(`http://localhost:8080/API/bpm/task?c=10&p=0&f=caseId=${idTask}`,
    {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
      'X-Bonita-API-Token': this.token}),
      observe: 'response',
      //withCredentials: true
    });

  }
  humanTask(idTask:number): any {
    return this.http.put(`http://localhost:8080/API/bpm/humanTask/${idTask}`,{"state": "completed"},
    {
      headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*',
      'X-Bonita-API-Token': this.token}),
      observe: 'response'
      /* withCredentials: true */
    });
  }
  // logout
  logout(): any {
    return this.http.get(`http://localhost:8080/bonita/logoutservice?redirect=false`);
  }
}
