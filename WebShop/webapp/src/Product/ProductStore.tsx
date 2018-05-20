import * as React from 'react';
import { observable, action, runInAction } from 'mobx';
import * as Inject from '../Inject';
import { Contracts } from '../contracts';
import callApi from '../callApi';
import PopupStore from '../Popup/PopupStore';
import Edit from './Edit';

const getInjects = (root: Inject.RootStore) => ({
    popupStore: root.get(PopupStore)
});

@Inject.inject(getInjects)
export default class ProductStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @observable private isFetchingProductList: boolean = false;
    @observable hasProductList: boolean = false;
    @observable productList: ReadonlyArray<Contracts.ProductDto> = [];

    @action
    pageCreated = async () => {
        if (!this.hasProductList)
            this.productListRequested();
    }

    @action
    productListRequested = async () => {
        if (!this.isFetchingProductList) {
            this.isFetchingProductList = true;
            var result = await callApi("Controllers.ProductsController.GetAll", null);
            runInAction(() => {
                this.hasProductList = true;
                this.productList = result;
                this.isFetchingProductList = false;
            });
        }
    }

    @action
    editProductClicked = (product: Contracts.ProductDto) => {
        this.injects.popupStore.render = () => <Edit product={product} />;
    }

}