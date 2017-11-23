import { FormControl } from '@angular/forms';

// RX
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export function emailValidator(control: FormControl): Observable<{ [key: string]: boolean }> {
	const value: string = control.value || '';
	// tslint:disable-next-line
	const valid: boolean =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
	return Observable.of(valid ? null : { nospecial: true });
}