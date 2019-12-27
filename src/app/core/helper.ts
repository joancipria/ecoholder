/**********************************************************************************
@name helper.ts
@description Clase con funciones genéricas para la aplicación
@author Diana Hernández Soler
@date 04/12/2019
@license GPLv3
***********************************************************************************/

import { Injectable } from '@angular/core';
import { LocalStorage } from '../core/services/localStorage.service';
import { Firebase } from '../core/services/firebase.service';
import * as introJs from 'intro.js/intro.js';

@Injectable()
export class Helper {
    constructor(
        private storage: LocalStorage,
        private firebase: Firebase
    ) { }

    /**********************************************************************************
    @description Si es la primera vez muestra el Tutorial
    @design  elemento HTML que contentra el tutorial,
    siguientePagina: String ( pagina siguiente del tutorial ) -> f() -> void
    @author Diana Hernández Soler
    @date 04/12/2019
    **********************************************************************************/
    public MostrarTutorial(navCtrl: any, siguientePagina: string): void {
        const urlNext = '/app/tabs/' + siguientePagina + '?multi-page=true';
        const uid = this.firebase.informacionUsuario().uid;
        this.storage.get(uid).then((val: any) => {
            if (val !== 'si') {
                // Raquel. Se inicia el tutorial
                introJs().start().oncomplete(() => {
                    navCtrl.navigateForward(urlNext);
                });
                // Si es la última parte del tutorial, se guarda 'si' para que no vuelva a salir el tutorial para ese usuario
                if (siguientePagina === 'home') { this.storage.set(uid, 'si'); }
            }
        });


    }

    /************************************************************************************
    @description Obtener imagen de perfil de gravatar
    @design f() -> (String) Link Gravatar
    @author Joan Ciprià Moreno Teodoro
    @date 02/11/2019
    ************************************************************************************/
    public obtenerImagenGravatar() {
        if (this.firebase.informacionUsuario()) {
            const email = this.firebase.informacionUsuario().email;
            // MD5 (Message-Digest Algorithm) by WebToolkit
            // tslint:disable-next-line: max-line-length
            const md5Hash = (s) => { function L(k, d) { return (k << d) | (k >>> (32 - d)) } function K(G, k) { let I, d, F, H, x; F = (G & 2147483648); H = (k & 2147483648); I = (G & 1073741824); d = (k & 1073741824); x = (G & 1073741823) + (k & 1073741823); if (I & d) { return (x ^ 2147483648 ^ F ^ H) } if (I | d) { if (x & 1073741824) { return (x ^ 3221225472 ^ F ^ H) } else { return (x ^ 1073741824 ^ F ^ H) } } else { return (x ^ F ^ H) } } function r(d, F, k) { return (d & F) | ((~d) & k) } function q(d, F, k) { return (d & k) | (F & (~k)) } function p(d, F, k) { return (d ^ F ^ k) } function n(d, F, k) { return (F ^ (d | (~k))) } function u(G, F, aa, Z, k, H, I) { G = K(G, K(K(r(F, aa, Z), k), I)); return K(L(G, H), F) } function f(G, F, aa, Z, k, H, I) { G = K(G, K(K(q(F, aa, Z), k), I)); return K(L(G, H), F) } function D(G, F, aa, Z, k, H, I) { G = K(G, K(K(p(F, aa, Z), k), I)); return K(L(G, H), F) } function t(G, F, aa, Z, k, H, I) { G = K(G, K(K(n(F, aa, Z), k), I)); return K(L(G, H), F) } function e(G) { let Z; let F = G.length; let x = F + 8; let k = (x - (x % 64)) / 64; let I = (k + 1) * 16; let aa = Array(I - 1); let d = 0; let H = 0; while (H < F) { Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = (aa[Z] | (G.charCodeAt(H) << d)); H++ } Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = aa[Z] | (128 << d); aa[I - 2] = F << 3; aa[I - 1] = F >>> 29; return aa } function B(x) { let k = '', F = '', G, d; for (d = 0; d <= 3; d++) { G = (x >>> (d * 8)) & 255; F = '0' + G.toString(16); k = k + F.substr(F.length - 2, 2) } return k } function J(k) { k = k.replace(/rn/g, 'n'); let d = ''; for (let F = 0; F < k.length; F++) { let x = k.charCodeAt(F); if (x < 128) { d += String.fromCharCode(x) } else { if ((x > 127) && (x < 2048)) { d += String.fromCharCode((x >> 6) | 192); d += String.fromCharCode((x & 63) | 128) } else { d += String.fromCharCode((x >> 12) | 224); d += String.fromCharCode(((x >> 6) & 63) | 128); d += String.fromCharCode((x & 63) | 128) } } } return d } let C = Array(); let P, h, E, v, g, Y, X, W, V; let S = 7, Q = 12, N = 17, M = 22; let A = 5, z = 9, y = 14, w = 20; let o = 4, m = 11, l = 16, j = 23; let U = 6, T = 10, R = 15, O = 21; s = J(s); C = e(s); Y = 1732584193; X = 4023233417; W = 2562383102; V = 271733878; for (P = 0; P < C.length; P += 16) { h = Y; E = X; v = W; g = V; Y = u(Y, X, W, V, C[P + 0], S, 3614090360); V = u(V, Y, X, W, C[P + 1], Q, 3905402710); W = u(W, V, Y, X, C[P + 2], N, 606105819); X = u(X, W, V, Y, C[P + 3], M, 3250441966); Y = u(Y, X, W, V, C[P + 4], S, 4118548399); V = u(V, Y, X, W, C[P + 5], Q, 1200080426); W = u(W, V, Y, X, C[P + 6], N, 2821735955); X = u(X, W, V, Y, C[P + 7], M, 4249261313); Y = u(Y, X, W, V, C[P + 8], S, 1770035416); V = u(V, Y, X, W, C[P + 9], Q, 2336552879); W = u(W, V, Y, X, C[P + 10], N, 4294925233); X = u(X, W, V, Y, C[P + 11], M, 2304563134); Y = u(Y, X, W, V, C[P + 12], S, 1804603682); V = u(V, Y, X, W, C[P + 13], Q, 4254626195); W = u(W, V, Y, X, C[P + 14], N, 2792965006); X = u(X, W, V, Y, C[P + 15], M, 1236535329); Y = f(Y, X, W, V, C[P + 1], A, 4129170786); V = f(V, Y, X, W, C[P + 6], z, 3225465664); W = f(W, V, Y, X, C[P + 11], y, 643717713); X = f(X, W, V, Y, C[P + 0], w, 3921069994); Y = f(Y, X, W, V, C[P + 5], A, 3593408605); V = f(V, Y, X, W, C[P + 10], z, 38016083); W = f(W, V, Y, X, C[P + 15], y, 3634488961); X = f(X, W, V, Y, C[P + 4], w, 3889429448); Y = f(Y, X, W, V, C[P + 9], A, 568446438); V = f(V, Y, X, W, C[P + 14], z, 3275163606); W = f(W, V, Y, X, C[P + 3], y, 4107603335); X = f(X, W, V, Y, C[P + 8], w, 1163531501); Y = f(Y, X, W, V, C[P + 13], A, 2850285829); V = f(V, Y, X, W, C[P + 2], z, 4243563512); W = f(W, V, Y, X, C[P + 7], y, 1735328473); X = f(X, W, V, Y, C[P + 12], w, 2368359562); Y = D(Y, X, W, V, C[P + 5], o, 4294588738); V = D(V, Y, X, W, C[P + 8], m, 2272392833); W = D(W, V, Y, X, C[P + 11], l, 1839030562); X = D(X, W, V, Y, C[P + 14], j, 4259657740); Y = D(Y, X, W, V, C[P + 1], o, 2763975236); V = D(V, Y, X, W, C[P + 4], m, 1272893353); W = D(W, V, Y, X, C[P + 7], l, 4139469664); X = D(X, W, V, Y, C[P + 10], j, 3200236656); Y = D(Y, X, W, V, C[P + 13], o, 681279174); V = D(V, Y, X, W, C[P + 0], m, 3936430074); W = D(W, V, Y, X, C[P + 3], l, 3572445317); X = D(X, W, V, Y, C[P + 6], j, 76029189); Y = D(Y, X, W, V, C[P + 9], o, 3654602809); V = D(V, Y, X, W, C[P + 12], m, 3873151461); W = D(W, V, Y, X, C[P + 15], l, 530742520); X = D(X, W, V, Y, C[P + 2], j, 3299628645); Y = t(Y, X, W, V, C[P + 0], U, 4096336452); V = t(V, Y, X, W, C[P + 7], T, 1126891415); W = t(W, V, Y, X, C[P + 14], R, 2878612391); X = t(X, W, V, Y, C[P + 5], O, 4237533241); Y = t(Y, X, W, V, C[P + 12], U, 1700485571); V = t(V, Y, X, W, C[P + 3], T, 2399980690); W = t(W, V, Y, X, C[P + 10], R, 4293915773); X = t(X, W, V, Y, C[P + 1], O, 2240044497); Y = t(Y, X, W, V, C[P + 8], U, 1873313359); V = t(V, Y, X, W, C[P + 15], T, 4264355552); W = t(W, V, Y, X, C[P + 6], R, 2734768916); X = t(X, W, V, Y, C[P + 13], O, 1309151649); Y = t(Y, X, W, V, C[P + 4], U, 4149444226); V = t(V, Y, X, W, C[P + 11], T, 3174756917); W = t(W, V, Y, X, C[P + 2], R, 718787259); X = t(X, W, V, Y, C[P + 9], O, 3951481745); Y = K(Y, h); X = K(X, E); W = K(W, v); V = K(V, g) } let i = B(Y) + B(X) + B(W) + B(V); return i.toLowerCase() };
            const size = 160;
            return 'http://www.gravatar.com/avatar/' + md5Hash(email) + '.jpg?s=' + size;

        }
    }

    /************************************************************************************
    @description Genera un pop-up con la información pasada como parámetro
    @design elementoHTML: elemento HTML donde se mostrará la información,
            texto: string,
            titulo: string -> f() -> void
    @author Diana Hernández Soler
    @date 02/11/2019
    ************************************************************************************/
    public mostrarVentana(elementoHTML: any, texto: string, titulo: string) {
        elementoHTML.create({
            message: texto,
            subHeader: titulo,
            buttons: [
                { text: 'CERRAR', role: 'cancel' }
            ]
        }).then(alert => {
            alert.present();
        });
    }


    /************************************************************************************
    @description Crear un modal de alerta
    @design elementoHTML: Elemento html dónde se mostrará la alerta,
            texto: string,
            subtexto: string,
            handlerAction: function -> f()-> void
    @author Diana Hernández Soler
    @date 02/11/2019
    DE MOMENTO NO FUNCIONA .- Ejecuta el handler de SI antes de mostrar la alerta ?
    ************************************************************************************/
    public mostrarConfirmacion(elementoHTML: any, texto: string, subtexto: string, handlerActionYES: any) {
        elementoHTML.create({
            message: texto,
            subHeader: subtexto,
            buttons: [
                { text: 'SI', handler: () => handlerActionYES },
                { text: 'NO', role: 'cancel', handler: () => console.log('Ha pulsado NO') }
            ]
        }).then(alert => {
            alert.present();
        });
    }

    // ----------------------------------------------------------------
    // Pequeño hack para poder leer los datos de firebase.
    // No se como se puede leer directamete sin que de fallo
    // data: Observable<Item> FirestoreData(?) -> f() -> json
    // ----------------------------------------------------------------
    public parsearDatos(data: any) {
        const rawData = JSON.stringify(data);
        return JSON.parse(rawData);
    }

    /************************************************************************************
    @description Test para comprobar que se guardar y se recuperan variables del Local Storage
    @design -> f()-> void
    @author Diana Hernández Soler
    @date 05/12/2019
    ************************************************************************************/
    public testLocalStorage() {

        console.log('=========== TEST LOCAL STORAGE ========================');
        // Guardamos una variable
        this.storage.set('pruebaClave', 'pruebaValor');
        // La mostramos por consola
        this.storage.get('pruebaClave').then(val => console.log('TLS acceso a la variable pruebaClave => ', val));
        // Cambiamos el valor de la variable anterior
        this.storage.set('pruebaClave', 'hola');
        // La mostramos por consola
        this.storage.get('pruebaClave').then(val => console.log('TLS se ha camabiado el valor de pruebaClave a => ', val));
    }

}