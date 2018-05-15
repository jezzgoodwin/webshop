import * as React from 'react';
import * as Inject from "./Inject";
import IRootStore from "./RootStore";


const getInjects = (root: IRootStore) => ({
    hello: root.hello
});

type IProps = Readonly<{
    goodbye: string;
}>

@Inject.inject(getInjects)
class InjectTest extends Inject.Component<Readonly<ReturnType<typeof getInjects>>, IProps> {
    render() {
        return (
            <div>
                Hello = {this.injects.hello},<br />
                Goodbye = {this.props.goodbye}
            </div>
        );
    }
}

export default InjectTest;
