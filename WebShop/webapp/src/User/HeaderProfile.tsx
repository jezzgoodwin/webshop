import * as React from 'react';
import { observer } from "mobx-react";
import * as Inject from '../Inject';
import StatusStore from './StatusStore';
import LoginStore from './LoginStore';

const getInjects = (root: Inject.RootStore) => ({
    statusStore: root.get(StatusStore),
    loginStore: root.get(LoginStore)
});

type IProps = Readonly<{
}>

@observer
@Inject.inject(getInjects)
export default class HeaderProfile extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    render() {
        return (
            <div>
                {this.injects.statusStore.hasLoginStatus ?
                    <div>
                        Is logged in: {this.injects.statusStore.isLoggedIn ? "yes" : "no"}
                        {this.injects.statusStore.isLoggedIn ?
                            <div>
                                <button onClick={this.injects.loginStore.logoutRequested}>
                                    Logout
                                </button>
                            </div>
                            :
                            <div>
                                <button onClick={this.injects.loginStore.loginDialogRequested}>
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
                {this.injects.loginStore.loginDialogOpen && (
                    <div>
                        Username: <input type="text" value={this.injects.loginStore.loginDialogUsername} onChange={this.injects.loginStore.loginDialogUsernameChanged} />
                        Password: <input type="text" value={this.injects.loginStore.loginDialogPassword} onChange={this.injects.loginStore.loginDialogPasswordChanged} />
                        <button onClick={this.injects.loginStore.loginRequested}>
                            Login
                        </button>
                    </div>
                )}
            </div>
        );
    }

}