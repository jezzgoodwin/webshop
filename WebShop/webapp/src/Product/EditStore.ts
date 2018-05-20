import { observable, action } from 'mobx';
import { Contracts } from '../contracts';

export default class EditStore {

    @observable id: number | null = null;
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
    sayNameClicked = () => {
        alert(this.name);
    }

}