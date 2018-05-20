import { observable } from 'mobx';

type Page = "product";

export default class PageStore {

    @observable page: Page = "product";

}