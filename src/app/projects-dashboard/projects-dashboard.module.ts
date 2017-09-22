import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

// Components
import { ModalComponent } from '../modal/modal.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsPanelComponent } from './projects-panel/projects-panel.component';
import { FormAddProjectComponent } from './form-add-project/form-add-project.component';
import { ProjectThumbComponent } from './project-thumb/project-thumb.component';
import { TaskComponent } from './task/task.component';
import { FormAddParticipantsComponent } from './project/form-add-participants/form-add-participants.component';

// Pipes
import { ReversePipe } from '../reverse.pipe';

import { routes } from './projects-dashboard.routes';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	],
	declarations: [
		ModalComponent,
		ProjectComponent,
		ProjectsPanelComponent,
		ProjectThumbComponent,
		FormAddProjectComponent,
		TaskComponent,
		ReversePipe,
		FormAddParticipantsComponent
	],
	providers: []
})
export class ProjectsDashboardModule { }
