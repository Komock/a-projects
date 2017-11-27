import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule }   from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

// Components
import { ModalComponent } from '../modal/modal.component';
import { ProjectsPanelComponent } from './projects-panel/projects-panel.component';
import { ProjectThumbComponent } from './project-thumb/project-thumb.component';
import { ProjectComponent } from './project/project.component';
import { BoardThumbComponent } from './board-thumb/board-thumb.component';
import { BoardComponent } from './board/board.component';
import { FormAddParticipantsComponent } from './project/form-add-participants/form-add-participants.component';
import { TaskListComponent } from './board/task-list/task-list.component';
import { TaskComponent } from './board/task-list/task/task.component';
import { TaskActionsComponent } from './board/task-actions/task-actions.component';
import { FormAddProjectComponent } from './form-add-project/form-add-project.component';

// Services

// Pipes
import { ReversePipe } from '../reverse.pipe';

// Routes
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
		FormAddParticipantsComponent,
		BoardComponent,
		BoardThumbComponent,
		TaskListComponent,
		TaskActionsComponent
	],
	providers: []
})
export class ProjectsDashboardModule { }
