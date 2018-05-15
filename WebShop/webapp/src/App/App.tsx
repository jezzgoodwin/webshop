import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import * as Inject from '../Inject';
import { AppStore } from './AppStore';
import LoginStatus from '../Login/Status';


const getInjects = (root: Inject.RootStore) => ({
    appStore: root.get("appStore") as AppStore
});

type IProps = Readonly<{
}>

@observer
@Inject.inject(getInjects)
class App extends Inject.Component<Readonly<ReturnType<typeof getInjects>>, IProps> {
    render() {
        return (
            <div>
                Seconds passed: {this.injects.appStore.timer} &nbsp;
                <button onClick={this.onReset}>
                    Reset
                </button>
                <LoginStatus />
                <DevTools />
            </div>
        );
    }

    onReset = () => {
        this.injects.appStore.resetTimer();
    }
};

export default App;