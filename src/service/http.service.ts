import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpService {
    constructor(public http: Http) {

    }

    //参考页面：http://www.cnblogs.com/madyina/p/5970814.html


    public httpGet(url: string, token?: string) {

        return this.http.get(url).toPromise()
            .then(res => res.json())
            .catch(err => {
                this.handleError(err);
            })
    }
    public httpGet_Allow_Origin(url: string, token?: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'text/plain');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('body', '');
        // //添加用户验证
        // if (token && token !== '')
        //     headers.append('Authorization', token);
        let options = new RequestOptions({
            headers: headers
        });
        return this.http.get(url, options).toPromise()
            .then(res => res.text())
            .catch(err => {
                this.handleError(err);
            })
    }

    public httpPost(url: string, body: any) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(url, body, options).toPromise()
            .then(res => res.json())
            .catch(err => {
                this.handleError(err);
            });
    }
    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error.json().error || 'Server Error');
    }

}