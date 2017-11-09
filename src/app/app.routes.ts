import { Route } from '@angular/router';

// Components
import { StartComponent } from './start/start.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from './profile/profile.component';
import { ShouldVerifyEmailComponent } from './should-verify-email/should-verify-email.component';

// Services
import { ProjectsPanelGuardService } from './projects-dashboard/projects-panel-guard.service';
import { SigninGuardService } from './sign-in/signin-guard.service';


export const routes: Route[] = [{
	path: '',
	component: StartComponent,
	data: { title: 'Start your Project today!' }
}, {
	path: 'signup',
	canActivate: [SigninGuardService],
	component: SignUpComponent,
	data: { title: 'Sign Up' }
}, {
	path: 'signin',
	canActivate: [SigninGuardService],
	component: SignInComponent,
	data: { title: 'Sign In' }
}, {
	path: 'profile',
	// canActivate: [SigninGuardService],
	component: ProfileComponent,
	data: { title: 'Profile' }
}, {
	path: 'should-verify-email',
	canActivate: [SigninGuardService],
	component: ShouldVerifyEmailComponent,
	data: { title: 'Verify e-mail' }
}, {
	path: 'projects',
	canActivate: [ProjectsPanelGuardService],
	loadChildren: 'app/projects-dashboard/projects-dashboard.module#ProjectsDashboardModule'
}, {
	path: '**',
	redirectTo: '',
	component: StartComponent
}];
