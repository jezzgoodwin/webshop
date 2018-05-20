import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import ProductStore from './ProductStore';
import Product from './Product';

const getInjects = (root: Inject.RootStore) => ({
    productStore: root.get(ProductStore)
});

type IProps = Readonly<{
}>

@observer
@Inject.inject(getInjects)
export default class Page extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    onCreated() {
        this.injects.productStore.pageCreated();
    }

    render() {
        return (
            <div>
                products
                {this.injects.productStore.hasProductList && (
                    <div>
                        {this.injects.productStore.productList.map(x => (
                            <Product key={x.id} product={x} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

}