import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef,
	HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { ModalService } from '../modal.service';
import { FormAddProjectComponent } from '../projects-dashboard/form-add-project/form-add-project.component';

@Component({
	selector: 'a-modal',
	templateUrl: './modal.component.html',
	entryComponents: [ FormAddProjectComponent ],
	styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
	@ViewChild('modalContent', { read: ViewContainerRef })
	public modal: ViewContainerRef;

	public modalClass: string = '';
	public childComponent: ComponentFactory<any>;
	public isOpen: string = '';
	public modalContext: ComponentRef<any>;

	public constructor(
		private _modalService: ModalService,
		private _componentFactoryResolver: ComponentFactoryResolver
	) { }

	public ngOnInit(): void {
		this._modalService.modalSequence$
			.subscribe((componentObj: { component: any, context: any, modalClass: string }) => {
				if (!componentObj) {
					this.close();
					return;
				}
				this.isOpen = 'modal--open';
				this.modalClass = componentObj.modalClass;
				this.childComponent = this._componentFactoryResolver.resolveComponentFactory(componentObj.component);
				this.modalContext = this.modal.createComponent(this.childComponent);
				Object.keys(componentObj.context)
					.forEach((key: string) => this.modalContext.instance[key] = componentObj.context[key]);
			});
	}

	@HostListener('window:keyup', ['$event.keyCode'])
	public close(code: number = 27): void {
		if (code !== 27 || !this.isOpen) {
			return;
		}
		this.isOpen = '';
		this.modalContext.destroy();
	}
}
