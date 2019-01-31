// tslint:disable-next-line:max-line-length
import { Directive, ViewContainerRef, Compiler, OnChanges, OnDestroy, Input, ComponentRef, ComponentFactory, ReflectiveInjector, Component } from '@angular/core';
import { TypeBuilder } from './type-builder';
import { CommonModule } from '@angular/common';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'app-dynamic-outlet'
})
export class DynamicOutletDirective implements OnChanges, OnDestroy {
  @Input() html: string;
  @Input() viewClass: any;
  @Input() viewName: string;
  @Input() imports: any[] = [CommonModule];

  viewRef: ComponentRef<any>;

  constructor(private vcRef: ViewContainerRef, private compiler: Compiler, private typeBuilder: TypeBuilder) { }

  private  processCompoentFactory(factory: ComponentFactory<any>) {
    const injector = ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
    this.viewRef = this.vcRef.createComponent(factory, 0, injector, []);
  }

  private buildComponent() {
    const html = this.html;
    if (!html) {
      return;
    }

    if (this.viewRef) {
      this.viewRef.destroy();
    }

    const compMetadata = new Component({
      selector: 'dynamic-html',
      template: this.html,
    });

    this.typeBuilder.createComponentFactory(this.compiler, compMetadata, this.viewClass, this.imports, this.viewName)
      .then(factory => this.processCompoentFactory(factory));
  }

  ngOnChanges() {
    if (!this.viewName) {
      throw new Error('A dynamic view must have a name!');
    }

    const componentFactory = this.typeBuilder.getFactory(this.viewName);

    if (this.viewRef) {
      this.viewRef.destroy();
    }

    if (componentFactory) {
      this.processCompoentFactory(componentFactory);
      return;
    }

    this.buildComponent();
  }

  ngOnDestroy() {
    if (this.viewRef) {
      this.viewRef.destroy();
    }
  }
}
