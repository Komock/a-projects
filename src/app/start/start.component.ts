import { Component } from '@angular/core';

// Animations
import { fadeInAnimation } from '../_animations/fade-in.animation';

@Component({
	selector: 'a-start',
	templateUrl: './start.component.html',
	styleUrls: ['./start.component.scss'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class StartComponent {
	public slides: any[] = [{
		title: 'Slide 1',
		url: 'http://lorempixel.com/600/300/food/1/'
	}, {
		title: 'Slide 2',
		url: 'http://lorempixel.com/600/300/food/3/'
	}];
}
