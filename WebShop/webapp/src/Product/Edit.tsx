import * as React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import { Contracts } from '../contracts';
import EditStore from './EditStore';
import CategoryStore from '../Category/CategoryStore';

const getInjects = (root: Inject.RootStore) => ({
    editStore: root.create(EditStore),
    categoryStore: root.get(CategoryStore)
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

    @computed get isReady() {
        return this.injects.categoryStore.hasList;
    }

    render() {
        return (
            <div>
                {this.isReady && (
                    <div>
                        Name: <input type="text" value={this.injects.editStore.name} onChange={this.injects.editStore.nameChanged} />
                        <ul>
                            {this.injects.categoryStore.list.map(x => (
                                <div key={x.id!} onClick={() => this.injects.editStore.categoryClicked(x.id!)}>
                                    <input type="checkbox" readOnly checked={this.injects.editStore.selectedCategories.has(x.id!)} /> {x.name}
                                </div>
                            ))}
                        </ul>
                        <button onClick={this.injects.editStore.saveClicked}>save</button>
                    </div>
                )}
            </div>
        );
    }

}