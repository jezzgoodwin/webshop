import * as React from 'react';
import { observable, action, runInAction } from 'mobx';
import * as Inject from '../Inject';
import { Contracts } from '../contracts';
import callApi from '../callApi';
import PopupStore from '../Popup/PopupStore';
import DialogStore from '../Dialog/DialogStore';
import Edit from './Edit';

const getInjects = (root: Inject.RootStore) => ({
    popupStore: root.get(PopupStore),
    dialogStore: root.get(DialogStore)
});

@Inject.inject(getInjects)
export default class ProductStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @observable private isFetchingList: boolean = false;
    @observable hasList: boolean = false;
    @observable list: ReadonlyArray<Contracts.ProductDto> = [];

    @action
    pageCreated = async () => {
        if (!this.hasList)
            this.listRequested();
    }

    @action
    listRequested = async () => {
        if (!this.isFetchingList) {
            this.isFetchingList = true;
            var result = await callApi("Controllers.ProductController.GetAll", null);
            runInAction(() => {
                this.hasList = true;
                this.list = result;
                this.isFetchingList = false;
            });
        }
    }

    @action
    editClicked = (product: Contracts.ProductDto) => {
        this.injects.popupStore.render = () => <Edit product={product} />;
    }

    @action
    newClicked = () => {
        this.injects.popupStore.render = () => <Edit product={{ name: "" }} />
    }

    @action
    deleteClicked = (id: number) => {
        var confirm = async () => {
            await callApi("Controllers.ProductController.Delete", { id });
            this.listRequested();
        };
        this.injects.dialogStore.confirmDialogRequested(confirm);
    }

}