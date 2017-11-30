import { Route } from '@angular/router';

// Components
import { StartComponent } from './start/start.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from './profile/profile.component';
import { ShouldVerifyEmailComponent } from './should-verify-email/should-verify-email.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

// Services
import { ProjectsPanelGuardService } from './projects-dashboard/projects-panel-guard.service';
import { AuthGuardService } from './auth-guard.service';
import { VerifyEmailGuardService } from './verify-email-guard.service';
import { ProjectsGuardService } from './projects-guard.service';


export const routes: Route[] = [{
	path: '',
	component: StartComponent,
	data: { title: 'Start your Project today!' }
}, {
	path: 'signup',
	canActivate: [VerifyEmailGuardService, ProjectsGuardService],
	component: SignUpComponent,
	data: { title: 'Sign Up' }
}, {
	path: 'signin',
	canActivate: [VerifyEmailGuardService, ProjectsGuardService],
	component: SignInComponent,
	data: { title: 'Sign In' }
}, {
	path: 'profile',
	canActivate: [AuthGuardService],
	component: ProfileComponent,
	data: { title: 'Profile' }
}, {
	path: 'should-verify-email',
	canActivate: [AuthGuardService],
	component: ShouldVerifyEmailComponent,
	data: { title: 'Verify e-mail' }
}, {
	path: 'verify-email',
	canActivate: [AuthGuardService, ProjectsGuardService],
	component: VerifyEmailComponent,
	data: { title: 'Verification' }
}, {
	path: 'projects',
	canActivate: [AuthGuardService, VerifyEmailGuardService],
	loadChildren: 'app/projects-dashboard/projects-dashboard.module#ProjectsDashboardModule'
}, {
	path: '**',
	redirectTo: '',
	component: StartComponent
}];
