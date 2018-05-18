import { observable, action } from 'mobx';
import callApi from '../callApi';
import { AppStore } from '../App/AppStore';

export class LoginStore {

    @observable private isFetchingLoginStatus: boolean = false;
    @observable hasLoginStatus: boolean = false;
    @observable isLoggedIn: boolean = false;

    @observable loginDialogOpen: boolean = false;
    @observable loginDialogUsername: string = "";
    @observable loginDialogPassword: string = "";

    constructor(
        private appStore: AppStore
    ) {
    }

    @action
    async componentCreated() {
        if (!this.isFetchingLoginStatus) {
            this.isFetchingLoginStatus = true;
            const result = await callApi("Controllers.AccountController.IsLoggedIn", null);
            this.loginStatusReceived(result.success);
        }
    }

    @action
    private loginStatusReceived = (isLoggedIn: boolean) => {
        console.log("login status received with timer at " + this.appStore.timer);
        this.isFetchingLoginStatus = false;
        this.hasLoginStatus = true;
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn)
            this.loginDialogOpen = false;
    }

    @action
    logoutRequested = async () => {
        await callApi("Controllers.AccountController.Logout", null);
        this.loginStatusReceived(false);
    }

    @action
    loginDialogRequested = () => {
        this.loginDialogOpen = true;
        this.loginDialogUsername = "";
        this.loginDialogPassword = "";
    }

    @action
    loginDialogUsernameChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.loginDialogUsername = event.currentTarget.value;
    }

    @action
    loginDialogPasswordChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.loginDialogPassword = event.currentTarget.value;
    }

    @action
    loginRequested = async () => {
        const result = await callApi("Controllers.AccountController.Login", { username: this.loginDialogUsername, password: this.loginDialogPassword });
        this.loginStatusReceived(result.success);
    }

}
