import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Empresas } from '../models/empresas';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = environment.ConexionWebApiProxy + 'empresas' + '/';
    //this.resourceUrl =  "https://localhost:44328/api/empresas" + "/";
  }

  get() {
    return this.httpClient.get(this.resourceUrl);
  }
  // mismo metodo tipado
  //  get():Observable<ArticuloFamilia[]> {
  //   return this.httpClient.get<ArticuloFamilia[]>(this.resourceUrl);
  // }
  post(obj: Empresas) {
    return this.httpClient.post(this.resourceUrl, obj);
  }
}
