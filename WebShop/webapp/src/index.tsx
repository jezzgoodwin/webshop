import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import * as Inject from './Inject';
import App from './App/App';

configure({
    enforceActions: true
});

ReactDOM.render(
    <Provider rootStore={Inject.instanceRootStore}>
        <App />
    </Provider>,
    document.getElementById('root'));
