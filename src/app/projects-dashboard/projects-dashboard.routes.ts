import { Route } from '@angular/router';

// Components
import { ProjectComponent } from './project/project.component';
import { ProjectsPanelComponent } from './projects-panel/projects-panel.component';

export const routes: Route[] = [{
	path: '',
	component: ProjectsPanelComponent,
	data: {
		title: 'Dashboard'
	},
	children: [
	{
		path: ':id',
		component: ProjectComponent
	}]
}];
