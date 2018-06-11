import * as React from 'react';
import { observer } from 'mobx-react';
import * as Inject from '../Inject';
import { Contracts } from '../contracts';
import ImageUploadStore from './ImageUploadStore';

const getInjects = (root: Inject.RootStore) => ({
    imageUploadStore: root.create(ImageUploadStore)
});

type IProps = Readonly<{
    product: Contracts.ProductDto;
}>

@observer
@Inject.inject(getInjects)
export default class ImageUpload extends Inject.Component<ReturnType<typeof getInjects>, IProps> {

    onCreated() {
        this.injects.imageUploadStore.componentCreated(this.props.product);
    }

    render() {
        return (
            <div>
                Upload image for "{this.injects.imageUploadStore.product!.name}"<br />
                File: <input type="file" onChange={this.injects.imageUploadStore.filesChanged} />
            </div>
        );
    }

}