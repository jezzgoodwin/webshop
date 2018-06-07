import { observable, action, runInAction } from 'mobx';
import { Contracts } from '../contracts';
import callApi from '../callApi';
import * as Inject from '../Inject';
import PopupStore from '../Popup/PopupStore';
import CategoryStore from './CategoryStore';

const getInjects = (root: Inject.RootStore) => ({
    popupStore: root.get(PopupStore),
    categoryStore: root.get(CategoryStore)
});

@Inject.inject(getInjects)
export default class EditStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @observable id?: number = undefined;
    @observable name: string = "";

    @action
    componentCreated = (product: Contracts.ProductDto) => {
        this.id = product.id;
        this.name = product.name;
    }

    @action
    nameChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.name = event.currentTarget.value;
    }

    @action
    saveClicked = async () => {
        await callApi("Controllers.CategoryController.Save", { id: this.id, name: this.name });
        runInAction(() => {
            this.injects.popupStore.render = null;
            this.injects.categoryStore.listRequested();
        });
    }

}