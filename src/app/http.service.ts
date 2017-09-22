import { Injectable } from '@angular/core';
import {
	BaseRequestOptions, Headers,
	Http, Request, Response, XHRBackend
} from '@angular/http';

// RX
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpService extends Http {

	public constructor(
		_backend: XHRBackend,
		_defaultOptions: BaseRequestOptions
	) {
		super(_backend, _defaultOptions);
	}

	public prepareHeaders(headersObj: HashMap): Headers {
		const headers: Headers = new Headers();
		Object.keys(headersObj)
			.forEach((key: string) => headers.append(key, headersObj[key]));
		return headers;
	}

	public get<T>(
		url: string,
		headersObj: HashMap = { 'Content-Type': 'text/html' }
	): Observable<T> {
		const preparedHeaders: Headers = this.prepareHeaders(headersObj);
		return this.request(new Request(this._defaultOptions.merge({
			url,
			headers: preparedHeaders,
			method: 'GET'
		})))
		.map((res: Response) => res.json())
		.catch((err: Error) => Observable.of([]));
	}

	public post<T>(
		url: string,
		body: any,
		headersObj: HashMap = { 'Content-Type': 'application/json' },
	): Observable<T> {
		const preparedHeaders: Headers = this.prepareHeaders(headersObj);
		return this.request(new Request(this._defaultOptions.merge({
			url,
			headers: preparedHeaders,
			method: 'POST',
			body
		})))
		.map((res: Response) => res.json())
		.catch((err: Error) => Observable.of([]));
	}

}