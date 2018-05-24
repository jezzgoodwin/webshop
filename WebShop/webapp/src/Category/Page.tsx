import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import CategoryStore from './CategoryStore';
import Category from './Category';
import UserStatusStore from '../User/StatusStore';

const getInjects = (root: Inject.RootStore) => ({
    categoryStore: root.get(CategoryStore),
    userStatusStore: root.get(UserStatusStore)
});

type IProps = Readonly<{
}>

@observer
@Inject.inject(getInjects)
export default class Page extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    onCreated() {
        this.injects.categoryStore.pageCreated();
    }

    render() {
        return (
            <div>
                categories
                {this.injects.categoryStore.hasList && (
                    <div>
                        {this.injects.categoryStore.list.map(x => (
                            <Category key={x.id} category={x} />
                        ))}
                    </div>
                )}
                {this.injects.userStatusStore.isLoggedIn && (
                    <button onClick={this.injects.categoryStore.newClicked}>
                        new
                    </button>
                )}
            </div>
        );
    }

}