import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
	transform(value: string, limit: number = 5): string {
		return Array.from(value).length > limit
			? `${value.substring(0, limit)}...`
			: value;
	}
}
