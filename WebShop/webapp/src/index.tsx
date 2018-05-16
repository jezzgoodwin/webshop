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

Inject.set("appStore", AppStore);
Inject.set("loginStore", LoginStore);

ReactDOM.render(
    <Provider rootStore={Inject.instanceRootStore}>
        <App />
    </Provider>,
    document.getElementById('root'));
