import { environment } from './src/environments/environment';
import { InjectionToken } from '@angular/core';
import { credentials } from './credentials';

export const DOMAIN: string = environment.domain;
export const DOMAIN_TOKEN: InjectionToken<string> = new InjectionToken(environment.domain);
export const FIREBASE: any = credentials.firebase;