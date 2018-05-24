import * as React from 'react';
import { action } from 'mobx';
import * as Inject from '../Inject';
import PopupStore from '../Popup/PopupStore';
import Confirm from './Confirm';

const getInjects = (root: Inject.RootStore) => ({
    popupStore: root.get(PopupStore)
});

@Inject.inject(getInjects)
export default class DialogStore extends Inject.Store<ReturnType<typeof getInjects>> {

    @action
    confirmDialogRequested = (onConfirm: () => void) => {
        var close = action(() => this.injects.popupStore.render = null);
        var confirm = () => {
            onConfirm();
            close();
        };
        this.injects.popupStore.render = () => <Confirm confirm={confirm} cancel={close} />;
    }

}