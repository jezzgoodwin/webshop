import { action } from 'mobx';
import * as Inject from '../Inject';
import StatusStore from '../User/StatusStore';

const getInjects = (root: Inject.RootStore) => ({
    statusStore: root.get(StatusStore)
});

@Inject.inject(getInjects)
export default class AppStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @action
    appCreated = async () => {
        this.injects.statusStore.statusRequired();
    }

}