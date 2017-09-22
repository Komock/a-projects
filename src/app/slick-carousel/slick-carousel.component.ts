import { Component, AfterViewInit, ElementRef, NgZone } from '@angular/core';

import * as $ from 'jquery';
require('slick-carousel');

@Component({
	selector: 'a-slick-carousel',
	template: '<ng-content></ng-content>',
	styleUrls: ['./slick-carousel.component.scss']
})
export class SlickCarouselComponent {
	public $carousel: JQuery<any> | any;
	public slides: any[] = [];
	private initialized: boolean = false;
	public constructor(
		private _zone: NgZone,
		private _el: ElementRef
		) {}

	public initCarousel(): void {
		this._zone.runOutsideAngular(() => {
			this.$carousel = $(this._el.nativeElement).slick({
				accessibility: false
			});
		});
		this.initialized = true;
	}

	public addSlide(slide: any): void {
		!this.initialized && this.initCarousel();
		this.slides.push(slide);
		this.$carousel.slick('slickAdd', slide._el.nativeElement);
	}

	public removeSlide(slide: any): void {
		const idx: number = this.slides.indexOf(slide);
		this.$carousel.slick('slickRemove', idx);
		this.slides = this.slides.filter( (s: any) => {
			return s !== slide;
		});
	}

	// public ngAfterViewInit(): void {
	// 	this.initCarousel();
	// }

}
