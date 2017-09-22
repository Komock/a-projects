import { trigger, state, animate, transition, style, AnimationTriggerMetadata } from '@angular/animations';

export const fadeInUpAnimation: AnimationTriggerMetadata =
	trigger('fadeInUpAnimation', [
		transition(':enter', [
			style({
				opacity: 0,
				transform: 'translateY(100%)'
			}),
			animate('.3s', style({
				opacity: 1,
				transform: 'translateY(0)'
			}))
		]),
	]);