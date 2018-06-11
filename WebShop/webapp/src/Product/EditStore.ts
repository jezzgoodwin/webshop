import { observable, action, runInAction } from 'mobx';
import { Contracts } from '../contracts';
import callApi from '../callApi';
import * as Inject from '../Inject';
import PopupStore from '../Popup/PopupStore';
import ProductStore from './ProductStore';
import CategoryStore from '../Category/CategoryStore';

const getInjects = (root: Inject.RootStore) => ({
    popupStore: root.get(PopupStore),
    productStore: root.get(ProductStore),
    categoryStore: root.get(CategoryStore)
});

@Inject.inject(getInjects)
export default class EditStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @observable id?: number = undefined;
    @observable name: string = "";
    @observable price: string = "";
    @observable description: string = "";
    selectedCategories = observable.map<number, boolean>();

    @action
    componentCreated = (product: Contracts.ProductDto) => {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price.toString();
        this.description = product.description;
        if (product.categories)
            product.categories.forEach(x => this.selectedCategories.set(x, true));
        this.injects.categoryStore.listRequested();
    }

    @action
    nameChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.name = event.currentTarget.value;
    }

    @action
    priceChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.price = event.currentTarget.value;
    }

    @action
    descriptionChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.description = event.currentTarget.value;
    }

    @action
    categoryClicked = (categoryId: number) => {
        if (this.selectedCategories.has(categoryId))
            this.selectedCategories.delete(categoryId);
        else
            this.selectedCategories.set(categoryId, true);
    }

    @action
    saveClicked = async () => {
        var price = parseFloat(this.price);
        if (isNaN(price))
            price = 0;
        await callApi(
            "Controllers.ProductController.Save",
            {
                id: this.id,
                name: this.name,
                price: price,
                description: this.description,
                categories: Array.from(this.selectedCategories.keys())
            });
        runInAction(() => {
            this.injects.popupStore.render = null;
            this.injects.productStore.listRequested();
        });
    }

}