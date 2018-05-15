import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import callApi from "./callApi";

class LoginStore {

    @observable private isFetchingLoginStatus: boolean = false;
    @observable hasLoginStatus: boolean = false;
    @observable isLoggedIn: boolean = false;

    @observable loginDialogOpen: boolean = false;
    @observable loginDialogUsername: string = "";
    @observable loginDialogPassword: string = "";

    @action
    componentCreated() {
        if (!this.isFetchingLoginStatus) {
            this.isFetchingLoginStatus = true;
            callApi("Account/IsLoggedIn", {}, result => this.loginStatusReceived(result.success));
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
    logoutRequested = () => {
        callApi("Account/Logout", {}, () => this.loginStatusReceived(false));
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
    loginRequested = () => {
        callApi("Account/Login", { Username: this.loginDialogUsername, Password: this.loginDialogPassword }, result => this.loginStatusReceived(result.success));
    }

}

const loginStore = new LoginStore();

@observer
class LoginStatus extends React.PureComponent {

    constructor(props: {}) {
        super(props);
        loginStore.componentCreated();
    }

    render() {
        return (
            <div>
                {loginStore.hasLoginStatus ?
                    <div>
                        Is logged in: {loginStore.isLoggedIn ? "yes" : "no"}
                        {loginStore.isLoggedIn ?
                            <div>
                                <button onClick={loginStore.logoutRequested}>
                                    Logout
                                </button>
                            </div>
                        :
                            <div>
                                <button onClick={loginStore.loginDialogRequested}>
                                    Login
                                </button>
                            </div>
                        }
                    </div>
                :
                    <div>
                        Checking login status...
                    </div>
                }
                {loginStore.loginDialogOpen &&
                    <div>
                        Username: <input type="text" value={loginStore.loginDialogUsername} onInput={loginStore.loginDialogUsernameChanged} />
                        Password: <input type="text" value={loginStore.loginDialogPassword} onInput={loginStore.loginDialogPasswordChanged} />
                        <button onClick={loginStore.loginRequested}>
                            Login
                        </button>

                    </div>
                }
            </div>
        );
    }

}

export default LoginStatus;