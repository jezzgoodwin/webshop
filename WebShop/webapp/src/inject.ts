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
        this.injects[key] = value;
    }
    get(key: string) {
        return this.injects[key];
    }
}

