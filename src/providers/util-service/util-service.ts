import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class UtilServiceProvider {

    constructor() { }

    getFoto(foto: string): string {
        if (foto) {
            return `${environment.urlApi}${environment.urnPhoto}/foto/${foto}`;
        }

        return '/assets/images/user-profile.png';
    }

    getFotoPorPessoa(idPessoa: number) {
        if (idPessoa) {
            return `${environment.urlApi}${environment.urnPhoto}/pessoa/${idPessoa}`;
        }

        return '/assets/images/user-profile.png';
    }

}
