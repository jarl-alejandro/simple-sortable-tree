import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import NodeList from './node-list';

class SortableTree extends React.Component {
    constructor(props) {
        super(props);
    }

    _onChange(updateList) {
        this.props.onChange(updateList);
    }

    handleChange(update) {
        this._onChange(update);
    }

    render() {

        const {
            className,
            component,
            dataList,
            levelOffset
        } = this.props;

        return (
            <div className={['sortable-tree', className].join(' ').trim()}>
                <NodeList
                    parentId={null}
                    data={dataList}
                    depth={0}
                    offset={levelOffset}
                    component={component}
                    onChange={ update => this.handleChange(update)} />
            </div>
        )
    }
}

SortableTree.defaultProps = {
    onChange: () => {},
    data: []
}

export default DragDropContext(HTML5Backend)(SortableTree);
