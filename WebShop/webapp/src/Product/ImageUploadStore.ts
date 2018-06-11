import { observable, action, runInAction } from 'mobx';
import * as Inject from '../Inject';
import { Contracts } from '../contracts';
import PopupStore from '../Popup/PopupStore';
import ProductStore from './ProductStore';

const getInjects = (root: Inject.RootStore) => ({
    popupStore: root.get(PopupStore),
    productStore: root.get(ProductStore)
});

@Inject.inject(getInjects)
export default class ImageUploadStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @observable.ref product?: Contracts.ProductDto;

    @action
    componentCreated = (product: Contracts.ProductDto) => {
        this.product = product;
    }

    @action
    filesChanged = async (event: React.FormEvent<HTMLInputElement>) => {

        var files = event.currentTarget.files;

        var data = new FormData();
        var length = files!.length;
        for (var i = 0; i < length; i++) {
            var file = files![i];
            data.append('files', file, file.name);
        }
        data.append("productId", this.product!.id!.toString());

        var response: Contracts.SuccessDto = await fetch('/productImageApi/upload', {
            method: 'POST',
            body: data
        })
        .then(response => response.json());

        if (response.success) {
            runInAction(() => {
                this.injects.popupStore.render = null;
                this.injects.productStore.listRequested();
            });
        }

    }

}