import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import { Contracts } from '../contracts';
import UserStatusStore from '../User/StatusStore';
import CategoryStore from './CategoryStore';

const getInjects = (root: Inject.RootStore) => ({
    userStatusStore: root.get(UserStatusStore),
    categoryStore: root.get(CategoryStore)
});

type IProps = Readonly<{
    category: Contracts.CategoryDto;
}>

@observer
@Inject.inject(getInjects)
export default class Category extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    render() {
        return (
            <div>
                Category = {this.props.category.name}
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
        this.injects.categoryStore.editClicked(this.props.category);
    }

    deleteClicked = () => {
        this.injects.categoryStore.deleteClicked(this.props.category.id);
    }

}