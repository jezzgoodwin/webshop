import { observable, action } from 'mobx';
import callApi from '../callApi';

export default class StatusStore {

    @observable private isFetchingStatus: boolean = false;
    @observable hasLoginStatus: boolean = false;
    @observable isLoggedIn: boolean = false;

    @action
    async statusRequired() {
        await this.statusRequested();
    }

    @action
    private async statusRequested() {
        if (!this.isFetchingStatus) {
            this.isFetchingStatus = true;
            const result = await callApi("Controllers.AccountController.IsLoggedIn", null);
            this.statusReceived(result.success);
        }
    }

    @action
    private statusReceived = (isLoggedIn: boolean) => {
        this.isFetchingStatus = false;
        this.hasLoginStatus = true;
        this.isLoggedIn = isLoggedIn;
    }

}