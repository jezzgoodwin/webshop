import { observable, action } from 'mobx';

export default class PopupStore {

    @observable render: (() => JSX.Element) | null = null;

    @action
    closeClicked = () => {
        this.render = null;
    }

}