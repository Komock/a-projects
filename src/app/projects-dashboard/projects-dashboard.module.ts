import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

// Components
import { ModalComponent } from '../modal/modal.component';
import { ProjectComponent } from './project/project.component';
import { BoardComponent } from './board/board.component';
import { BoardThumbComponent } from './board-thumb/board-thumb.component';
import { ProjectsPanelComponent } from './projects-panel/projects-panel.component';
import { FormAddProjectComponent } from './form-add-project/form-add-project.component';
import { ProjectThumbComponent } from './project-thumb/project-thumb.component';
import { TaskComponent } from './task/task.component';
import { FormAddParticipantsComponent } from './project/form-add-participants/form-add-participants.component';

// Services
import { BoardGuardService } from './board/board-guard.service';

// Pipes
import { ReversePipe } from '../reverse.pipe';

import { routes } from './projects-dashboard.routes';
import { TaskListComponent } from './board/task-list/task-list.component';
import { TaskActionsComponent } from './board/task-actions/task-actions.component';

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
		FormAddParticipantsComponent,
		BoardComponent,
		BoardThumbComponent,
		TaskListComponent,
		TaskActionsComponent
	],
	providers: [
		BoardGuardService
	]
})
export class ProjectsDashboardModule { }
