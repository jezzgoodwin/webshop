import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import ProductStore from './ProductStore';
import Product from './Product';
import UserStatusStore from '../User/StatusStore';

const getInjects = (root: Inject.RootStore) => ({
    productStore: root.get(ProductStore),
    userStatusStore: root.get(UserStatusStore)
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
                {this.injects.productStore.hasList && (
                    <div>
                        {this.injects.productStore.list.map(x => (
                            <Product key={x.id!} product={x} />
                        ))}
                    </div>
                )}
                {this.injects.userStatusStore.isLoggedIn && (
                    <button onClick={this.injects.productStore.newClicked}>
                        new
                    </button>
                )}
            </div>
        );
    }

}