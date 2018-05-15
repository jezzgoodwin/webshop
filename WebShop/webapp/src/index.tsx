import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import * as Inject from './Inject';
import { AppStore } from './App/AppStore';
import { LoginStore } from './Login/LoginStore';
import App from './App/App';

configure({
    enforceActions: true
});

const rootStore = new Inject.RootStore();
rootStore.set("appStore", new AppStore());
rootStore.set("loginStore", new LoginStore());

ReactDOM.render(
    <Provider rootStore={rootStore}>
        <App />
    </Provider>,
    document.getElementById('root'));
