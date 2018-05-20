import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import PageStore from './PageStore';
import ProductPage from '../Product/Page';

const getInjects = (root: Inject.RootStore) => ({
    pageStore: root.get(PageStore)
});

type IProps = Readonly<{
}>

@observer
@Inject.inject(getInjects)
export default class Page extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    render() {
        return (
            <div>
                {this.injects.pageStore.page == "product" &&
                    <ProductPage />
                }
            </div>
        );
    }

}