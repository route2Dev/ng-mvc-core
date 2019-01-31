import { Injectable, ComponentFactory, Compiler, Component, ModuleWithComponentFactories, NgModule } from '@angular/core';

@Injectable()
export class TypeBuilder {

  private factoryCache: {[key: string]: ComponentFactory<any>} = {};

  getFactory(url: string) {
    return this.factoryCache[url];
  }

  createComponentFactory(compiler: Compiler, metadata: Component, componentClass: any,
    imports: any[], url): Promise<ComponentFactory<any>> {

    let factory = this.getFactory(url);

    if (factory) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise((resolve) => {
        resolve(factory);
      });
    }

    const decoratedCmp = Component(metadata)(componentClass);

    @NgModule({ imports: imports, declarations: [decoratedCmp] })
    class DynamicHtmlModule { }

    return compiler.compileModuleAndAllComponentsAsync(DynamicHtmlModule)
      .then((moduleWithComponentFactory: ModuleWithComponentFactories<any>) => {
        factory = moduleWithComponentFactory.componentFactories.find(x => x.componentType === decoratedCmp);
        this.factoryCache[url] = factory;
        return factory;
      });
  }
}
