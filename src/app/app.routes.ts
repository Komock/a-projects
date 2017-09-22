import { Route } from '@angular/router';

// Components
import { StartComponent } from './start/start.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

// Services
import { ProjectsPanelGuardService } from './projects-dashboard/projects-panel-guard.service';


export const routes: Route[] = [{
	path: '',
	component: StartComponent,
	data: { title: 'Start your Project today!' }
}, {
	path: 'signup',
	component: SignUpComponent,
	data: { title: 'Sign Up' }
}, {
	path: 'signin',
	component: SignInComponent,
	data: { title: 'Sign In' }
}, {
	path: 'projects',
	canActivate: [ProjectsPanelGuardService],
	loadChildren: 'app/projects-dashboard/projects-dashboard.module#ProjectsDashboardModule'
}, {
	path: '**',
	redirectTo: '',
	component: StartComponent
}];
