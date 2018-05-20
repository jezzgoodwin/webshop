import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import { Contracts } from '../contracts';
import EditStore from './EditStore';

const getInjects = (root: Inject.RootStore) => ({
    editStore: root.create(EditStore)
});

type IProps = Readonly<{
    product: Contracts.ProductDto;
}>

@observer
@Inject.inject(getInjects)
export default class Edit extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    onCreated() {
        this.injects.editStore.componentCreated(this.props.product);
    }

    render() {
        return (
            <div>
                Name: <input type="text" value={this.injects.editStore.name} onChange={this.injects.editStore.nameChanged} />
                <button onClick={this.injects.editStore.sayNameClicked}>say</button>
            </div>
        );
    }

}