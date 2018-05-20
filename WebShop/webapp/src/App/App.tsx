import * as React from 'react';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import * as Inject from '../Inject';
import AppStore from './AppStore';
import HeaderProfile from '../User/HeaderProfile';
import Page from '../Page/Page';
import PopupBodyInsert from '../Popup/BodyInsert';

const getInjects = (root: Inject.RootStore) => ({
    appStore: root.get(AppStore)
});

type IProps = Readonly<{
}>

@observer
@Inject.inject(getInjects)
export default class App extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    onCreated() {
        this.injects.appStore.appCreated();
    }

    render() {
        return (
            <div>
                <HeaderProfile />
                <Page />
                <PopupBodyInsert />
                <DevTools />
            </div>
        );
    }

}