import * as React from 'react';
import { observer } from "mobx-react";
import * as Inject from '../Inject';
import { LoginStore } from './LoginStore';

const getInjects = (root: Inject.RootStore) => ({
    loginStore: root.get("loginStore") as LoginStore
});

type IProps = Readonly<{
}>

@observer
@Inject.inject(getInjects)
class Status extends Inject.Component<Readonly<ReturnType<typeof getInjects>>, IProps> {

    constructor(props: any, context: any) {
        super(props, context);
        this.injects.loginStore.componentCreated();
    }

    render() {
        return (
            <div>
                {this.injects.loginStore.hasLoginStatus ?
                    <div>
                        Is logged in: {this.injects.loginStore.isLoggedIn ? "yes" : "no"}
                        {this.injects.loginStore.isLoggedIn ?
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
                {this.injects.loginStore.loginDialogOpen &&
                    <div>
                        Username: <input type="text" value={this.injects.loginStore.loginDialogUsername} onInput={this.injects.loginStore.loginDialogUsernameChanged} />
                        Password: <input type="text" value={this.injects.loginStore.loginDialogPassword} onInput={this.injects.loginStore.loginDialogPasswordChanged} />
                        <button onClick={this.injects.loginStore.loginRequested}>
                            Login
                        </button>

                    </div>
                }
            </div>
        );
    }

}

export default Status;
