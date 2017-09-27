
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';


const BASE_URL = 'http://localhost:8002/etl/poc-user-feedback/1000/1501770200.477992';


@Injectable()
export class SeedService {

    constructor(private http: Http) {
    }
    getScrollMessages(): Observable<any> {
        return this.http.get(BASE_URL)
        .map(res => res.json())
        // errors if any
        .catch((error: any) => Observable.throw(error.json.error || 'Server error'));
    }
}
