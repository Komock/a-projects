import { Route } from '@angular/router';

// Components
import { ProjectComponent } from './project/project.component';
import { BoardComponent } from './board/board.component';
import { ProjectsPanelComponent } from './projects-panel/projects-panel.component';

// Services
import { BoardGuardService } from './board/board-guard.service';

export const routes: Route[] = [{
	path: '',
	component: ProjectsPanelComponent,
	data: {
		title: 'Dashboard'
	},
	children: [
	{
		path: ':key',
		component: ProjectComponent,
		data: {
			title: 'Project'
		},
		children: [
			{
				path: ':key',
				canActivate: [BoardGuardService],
				component: BoardComponent,
				data: {
					title: 'Board'
				}
			}
		]
	}]
}];
