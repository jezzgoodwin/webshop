import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import PopupStore from './PopupStore';
import PopupContainer from './PopupContainer';

const getInjects = (root: Inject.RootStore) => ({
    popupStore: root.get(PopupStore)
});

type IProps = Readonly<{
}>

@observer
@Inject.inject(getInjects)
export default class BodyInsert extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    render() {
        if (!this.injects.popupStore.render) {
            return null;
        }
        return (
            <PopupContainer>
                {this.injects.popupStore.render()}
                <div>
                    <button onClick={this.injects.popupStore.closeClicked}>close</button>
                </div>
            </PopupContainer>
        );
    }

}