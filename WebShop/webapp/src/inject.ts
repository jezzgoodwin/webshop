import * as React from 'react';
import * as PropTypes from 'prop-types';

export function inject(injectFunc: (providers: any) => any) {
    return function (componentClass: any) {
        componentClass.injectFunc = injectFunc;
        componentClass.contextTypes = {
            mobxStores: PropTypes.object
        }
        return componentClass;
    }
}

export class Component<TInject, TProps> extends React.Component<TProps> {
    protected injects: TInject;
    constructor(props: any, context: any) {
        super(props, context);
        this.injects = (this as any).__proto__.constructor.injectFunc(context.mobxStores.rootStore);
        this.onCreated();
    }
    protected onCreated() {
    }
};

export class Store<TInject> {
    protected injects: TInject;
    constructor(rootStore: any) {
        this.injects = (this as any).__proto__.constructor.injectFunc(rootStore);
    }
}

interface IInject<T> {
    classType: { new(): T };
    instance: T;
}

export class RootStore {

    private injects: IInject<any>[] = [];

    private set<T>(classType: { new(rootStore?: RootStore): T }): void {
        var instance = new classType(this);
        this.injects.push({
            classType,
            instance
        });
    }

    get<T>(classType: { new(rootStore?: RootStore): T }): T {
        var inject = this.injects.find(x => x.classType === classType);
        if (!inject) {
            this.set(classType);
            inject = this.injects.find(x => x.classType === classType);
        }
        return inject!.instance;
    }

    create<T>(classType: { new(rootStore?: RootStore): T }): T {
        return new classType(this);
    }

}

export const instanceRootStore = new RootStore();