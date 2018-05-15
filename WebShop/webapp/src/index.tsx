import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { configure, observable, action } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import LoginStatus from './LoginStatus';
import InjectTest from './InjectTest';

configure({
    enforceActions: true
});

class RootState {
    constructor(public appState: AppState) {
    }
}

class AppState {
    @observable timer = 0;

    constructor() {
        setInterval(() => {
            this.increaseTimer();
        }, 1000);
    }

    @action
    increaseTimer() {
        this.timer += 1;
    }

    @action
    resetTimer() {
        this.timer = 0;
    }
}

@inject("rootState")
@observer
class TimerView extends React.PureComponent<{ rootState?: RootState }, {}> {
    render() {
        return (
            <div>
                Seconds passed: {this.props.rootState!.appState.timer} &nbsp;
                <ResetButton onClick={this.onReset} />
                <LoginStatus />
                <InjectTest goodbye="adios" />
                <DevTools />
            </div>
        );
     }

     onReset = () => {
         this.props.rootState!.appState.resetTimer();
     }
};

@observer
class ResetButton extends React.PureComponent<{ onClick: () => void }> {
    render() {
        return (
            <button onClick={this.props.onClick}>
                Reset
            </button>
        );
    }
}

const rootState = new RootState(new AppState());

ReactDOM.render(
    <Provider rootState={rootState} hello="welcome">
        <TimerView />
    </Provider>,
    document.getElementById('root'));
