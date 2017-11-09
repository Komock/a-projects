import { trigger, state, animate, transition, style, AnimationTriggerMetadata } from '@angular/animations';

export const fadeInAnimation: AnimationTriggerMetadata =
	trigger('fadeInAnimation', [
		transition(':enter', [
			style({ opacity: 0 }),
			animate('.3s', style({ opacity: 1 }))
		]),
		transition(':leave', [
			style({ opacity: 1 }),
			animate('.3s', style({ opacity: 0 }))
		])
	]);