import { observable, action } from 'mobx';
import callApi from '../callApi';

export class LoginStore {

    @observable private isFetchingLoginStatus: boolean = false;
    @observable hasLoginStatus: boolean = false;
    @observable isLoggedIn: boolean = false;

    @observable loginDialogOpen: boolean = false;
    @observable loginDialogUsername: string = "";
    @observable loginDialogPassword: string = "";

    @action
    async componentCreated() {
        if (!this.isFetchingLoginStatus) {
            this.isFetchingLoginStatus = true;
            const result = await callApi("Account/IsLoggedIn", {});
            this.loginStatusReceived(result.success);
        }
    }

    @action
    private loginStatusReceived = (isLoggedIn: boolean) => {
        this.isFetchingLoginStatus = false;
        this.hasLoginStatus = true;
        this.isLoggedIn = isLoggedIn;
        if (isLoggedIn)
            this.loginDialogOpen = false;
    }

    @action
    logoutRequested = async () => {
        await callApi("Account/Logout", {});
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
        const result = await callApi("Account/Login", { Username: this.loginDialogUsername, Password: this.loginDialogPassword });
        this.loginStatusReceived(result.success);
    }

}
