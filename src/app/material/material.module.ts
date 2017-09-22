import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdProgressBarModule, MdMenuModule, MdIconModule, MdCardModule,
		MdToolbarModule, MdButtonModule, MdCheckboxModule, MdChipsModule,
		MdProgressSpinnerModule, MdInputModule, MdDialogModule, MdTabsModule,
		MdListModule } from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		MdButtonModule,
		MdCheckboxModule,
		MdChipsModule,
		MdToolbarModule,
		MdCardModule,
		MdIconModule,
		MdMenuModule,
		MdProgressSpinnerModule,
		MdInputModule,
		MdDialogModule,
		MdProgressBarModule,
		MdTabsModule,
		MdListModule
	],
	exports: [
		MdButtonModule,
		MdCheckboxModule,
		MdChipsModule,
		MdToolbarModule,
		MdCardModule,
		MdIconModule,
		MdMenuModule,
		MdProgressSpinnerModule,
		MdInputModule,
		MdDialogModule,
		MdProgressBarModule,
		MdTabsModule,
		MdListModule
	],
	declarations: []
})
export class MaterialModule { }
