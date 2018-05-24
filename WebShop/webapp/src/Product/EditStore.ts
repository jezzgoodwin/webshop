﻿import { observable, action, runInAction } from 'mobx';
import { Contracts } from '../contracts';
import callApi from '../callApi';
import * as Inject from '../Inject';
import PopupStore from '../Popup/PopupStore';
import ProductStore from './ProductStore';

const getInjects = (root: Inject.RootStore) => ({
    popupStore: root.get(PopupStore),
    productStore: root.get(ProductStore)
});

@Inject.inject(getInjects)
export default class EditStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @observable id: number | null = null;
    @observable name: string = "";

    @action
    componentCreated = (product: Contracts.EditProductDto) => {
        this.id = product.id;
        this.name = product.name;
    }

    @action
    nameChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.name = event.currentTarget.value;
    }

    @action
    saveClicked = async () => {
        await callApi("Controllers.ProductController.Save", { id: this.id, name: this.name });
        runInAction(() => {
            this.injects.popupStore.render = null;
            this.injects.productStore.listRequested();
        });
    }

}