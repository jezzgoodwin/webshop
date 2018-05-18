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

export class Component<TInject, TProps> extends React.PureComponent<TProps> {
    protected injects: TInject;
    constructor(props: any, context: any) {
        super(props, context);
        this.injects = (this as any).__proto__.constructor.injectFunc(context.mobxStores.rootStore);
    }
};

export class RootStore {

    private injects: { [key: string]: any } = {};

    set(key: string, value: any) {

        // find injects
        var cnst: string = value.toString();
        var lb = cnst.split("(", 2);
        var rb = lb[1].split(")", 2);
        var parts = rb[0].split(",");
        var words = parts.map(x => x.trim()).filter(x => x != "");

        var injects = words.map(x => this.injects[x]);

        // create object
        var object = new value(...injects);
        this.injects[key] = object;
    }

    get(key: string) {
        return this.injects[key];
    }

}

export const instanceRootStore = new RootStore();
export const set = (key: string, value: any) => instanceRootStore.set(key, value);
