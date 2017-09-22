import { Directive, ElementRef, Host, AfterViewInit, OnDestroy } from '@angular/core';
import { SlickCarouselComponent } from './slick-carousel.component';

import * as $ from 'jquery';
require('slick-carousel');

@Directive({
	selector: '[aSlickCarouselItem]'
})
export class SlickCarouselItemDirective {

	public constructor(
		private _el: ElementRef,
		@Host() private carousel: SlickCarouselComponent
	) {}

	public ngAfterViewInit(): void {
		this.carousel.addSlide(this);
	}

	public ngOnDestroy(): void {
		this.carousel.removeSlide(this);
	}
}