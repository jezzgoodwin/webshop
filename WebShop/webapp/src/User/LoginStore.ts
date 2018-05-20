import { observable, action, runInAction } from 'mobx';
import * as Inject from '../Inject';
import callApi from '../callApi';
import StatusStore from './StatusStore';

const getInjects = (root: Inject.RootStore) => ({
    statusStore: root.get(StatusStore)
});

@Inject.inject(getInjects)
export default class LoginStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @observable loginDialogOpen: boolean = false;
    @observable loginDialogUsername: string = "";
    @observable loginDialogPassword: string = "";

    @action
    logoutRequested = async () => {
        await callApi("Controllers.AccountController.Logout", null);
        this.injects.statusStore.statusRequired();
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
        var result = await callApi("Controllers.AccountController.Login", { username: this.loginDialogUsername, password: this.loginDialogPassword });
        if (result.success) {
            this.injects.statusStore.statusRequired();
            runInAction(() => {
                this.loginDialogOpen = false;
            });
        }
    }

}