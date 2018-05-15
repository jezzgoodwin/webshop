import { observable, action } from 'mobx';

export class AppStore {
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
