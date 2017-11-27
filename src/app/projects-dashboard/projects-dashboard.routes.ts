import { Route } from '@angular/router';

// Components
import { ProjectComponent } from './project/project.component';
import { BoardComponent } from './board/board.component';
import { ProjectsPanelComponent } from './projects-panel/projects-panel.component';
import { TaskActionsComponent } from './board/task-actions/task-actions.component';

export const routes: Route[] = [{
	path: '',
	component: ProjectsPanelComponent,
	data: {
		title: 'Dashboard'
	},
	children: [
	{
		path: ':uid/:key',
		component: ProjectComponent,
		data: {
			title: 'Project'
		},
		children: [
			{
				path: ':key',
				component: BoardComponent,
				data: {
					title: 'Board'
				}
			}
		]
	}]
}];
