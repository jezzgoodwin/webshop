import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import { Contracts } from '../contracts';
import UserStatusStore from '../User/StatusStore';
import ProductStore from './ProductStore';

const getInjects = (root: Inject.RootStore) => ({
    userStatusStore: root.get(UserStatusStore),
    productStore: root.get(ProductStore)
});

type IProps = Readonly<{
    product: Contracts.ProductDto;
}>

@observer
@Inject.inject(getInjects)
export default class Product extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    render() {
        return (
            <div>
                {this.props.product.name}
                {this.injects.userStatusStore.isLoggedIn && (
                    <div>
                        <button onClick={this.editClicked}>
                            edit
                        </button>
                        <button onClick={this.deleteClicked}>
                            delete
                        </button>
                    </div>
                )}
            </div>
        );
    }

    editClicked = () => {
        this.injects.productStore.editClicked(this.props.product);
    }

    deleteClicked = () => {
        this.injects.productStore.deleteClicked(this.props.product.id!);
    }

}