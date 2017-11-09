// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { HttpClientModule, HttpClient }   from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { MaterialModule } from './material/material.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Components
import { AppComponent } from './app/app.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { StartComponent } from './start/start.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SlickCarouselComponent } from './slick-carousel/slick-carousel.component';
import { SlickCarouselItemDirective } from './slick-carousel/slick-carousel-item.directive';

// Services
import { TitleService } from './title.service';
import { ProjectsService } from './projects.service';
import { TaskListService } from './task-list.service';
import { UserService } from './user.service';
import { ModalService } from './modal.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ProjectsPanelGuardService } from './projects-dashboard/projects-panel-guard.service';
import { SigninGuardService } from './sign-in/signin-guard.service';


// Config
import { DOMAIN, DOMAIN_TOKEN, FIREBASE } from '../../config';

// Routes
import { routes } from './app.routes';
import { ShouldVerifyEmailComponent } from './should-verify-email/should-verify-email.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		NavComponent,
		StartComponent,
		SignInComponent,
		SignUpComponent,
		SlickCarouselComponent,
		SlickCarouselItemDirective,
		ShouldVerifyEmailComponent,
		ProfileComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		MaterialModule,
		RouterModule.forRoot(routes),
		BrowserAnimationsModule,
		AngularFireModule.initializeApp(FIREBASE),
		AngularFireDatabaseModule, // imports firebase/database, only needed for database features
		AngularFireAuthModule, // imports firebase/auth, only needed for auth features
	],
	providers: [
		{
			provide: DOMAIN_TOKEN,
			useValue: DOMAIN
		},
		HttpClient,
		TitleService,
		ProjectsService,
		TaskListService,
		UserService,
		ModalService,
		AngularFireDatabase,
		ProjectsPanelGuardService,
		SigninGuardService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
