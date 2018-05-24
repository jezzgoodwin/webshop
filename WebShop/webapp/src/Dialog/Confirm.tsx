import * as React from 'react';

type IProps = Readonly<{
    confirm: () => void;
    cancel: () => void;
}>

export default class Confirm extends React.PureComponent<IProps> {
    render() {
        return (
            <div>
                Confirm?<br />
                <button onClick={this.props.confirm}>
                    Confirm
                </button>
                <button onClick={this.props.cancel}>
                    Cancel
                </button>
            </div>
        );
    }
}