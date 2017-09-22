import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'reverse'
})
export class ReversePipe implements PipeTransform {

	public transform(arr: any[]): any[] {
		const copy: any[] = arr.slice();
		return copy.reverse();
	}

}
