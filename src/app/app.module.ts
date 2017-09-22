// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }   from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseRequestOptions, HttpModule } from '@angular/http';
import { MaterialModule } from './material/material.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { StartComponent } from './start/start.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SlickCarouselComponent } from './slick-carousel/slick-carousel.component';
import { SlickCarouselItemDirective } from './slick-carousel/slick-carousel-item.directive';

// Services
import { HttpService } from './http.service';
import { TitleService } from './title.service';
import { ProjectsService } from './projects.service';
import { UserService } from './user.service';
import { ModalService } from './modal.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ProjectsPanelGuardService } from './projects-dashboard/projects-panel-guard.service';

// Config
import { DOMAIN, DOMAIN_TOKEN, FIREBASE } from '../../config';

// Routes
import { routes } from './app.routes';


@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		NavComponent,
		StartComponent,
		SignInComponent,
		SignUpComponent,
		SlickCarouselComponent,
		SlickCarouselItemDirective
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
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
		HttpService,
		TitleService,
		ProjectsService,
		UserService,
		ModalService,
		BaseRequestOptions,
		AngularFireDatabase,
		ProjectsPanelGuardService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
