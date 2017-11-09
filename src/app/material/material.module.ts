import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule, MatMenuModule, MatIconModule, MatCardModule,
		MatToolbarModule, MatButtonModule, MatCheckboxModule, MatChipsModule,
		MatProgressSpinnerModule, MatInputModule, MatDialogModule, MatTabsModule,
		MatListModule, MatSidenavModule, MatSelectModule } from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatCheckboxModule,
		MatChipsModule,
		MatToolbarModule,
		MatCardModule,
		MatIconModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatInputModule,
		MatDialogModule,
		MatProgressBarModule,
		MatTabsModule,
		MatListModule,
		MatSidenavModule,
		MatSelectModule
	],
	exports: [
		MatButtonModule,
		MatCheckboxModule,
		MatChipsModule,
		MatToolbarModule,
		MatCardModule,
		MatIconModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatInputModule,
		MatDialogModule,
		MatProgressBarModule,
		MatTabsModule,
		MatListModule,
		MatSidenavModule,
		MatSelectModule
	],
	declarations: []
})
export class MaterialModule { }
