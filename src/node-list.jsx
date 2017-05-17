import React from 'react';

import TreeNode from './tree-node';

const NodeList = ({component, data, depth, offset, parentId, parentIndex, onChange}) => {

    const dataCopy = () => { return data.slice() }

    const moveItem = (dragIndex, hoverIndex) => {
        let items = dataCopy();
        const dragItem = items[dragIndex];
        items.splice(dragIndex, 1);
        items.splice(hoverIndex, 0, dragItem);
        onChange(items);
    }

    const updateNode = (update, index) => {
        let items = dataCopy();
        items[index] = update;
        onChange(items);
    }

    const removeNode = index => {
        let items = dataCopy();
        items.splice(index, 1);
        onChange(items);
    }

    const updateItemDepth = (dragIndex, hoverIndex) => {
        let items = dataCopy();
        const dragItem = items[dragIndex];
        if(typeof dragItem === 'undefined') { return; }
        if(typeof items[hoverIndex] === 'undefined') { return; }
        if(items[hoverIndex].menuItems) {
            items[hoverIndex].menuItems.push(dragItem);
        } else {
            items[hoverIndex].menuItems = [dragItem]
        }
        items.splice(dragIndex, 1);
        onChange(items);
        if(items[hoverIndex]) {
            return items[hoverIndex].menuItems.length;
        } else {
            return 0;
        }
    }

    const handleMoveUp = (data, dragIndex, dragParentIndex) => {
        let items = dataCopy();
        if(!items[dragParentIndex]) { return; }
        if(!items[dragParentIndex].menuItems) {
            items[dragParentIndex].menuItems = [data];
        } else {
            items[dragParentIndex].menuItems.splice(dragIndex, 1);
            items.splice(dragParentIndex + 1, 0, data);
        }
        onChange(items);
    }

    let childNodes = null;
    if(Array.isArray(data) && data.length > 0) {

        let className = 'node-list';
        if(depth > 0) {
            className += ` child-nodes child-nodes-depth-${depth}`
        }

        const style = { marginLeft: `${offset * depth}px`};
        // if(hide) {
        //     style['display'] = 'none';
        // }

        childNodes =
        <div className={className}
             style={style}>
            {data.map( (item, index) => (
                <TreeNode
                    key={index}
                    depth={depth}
                    offset={offset}
                    component={component}
                    data={item}
                    parentIndex={parentIndex}
                    parentId={parentId}
                    index={index}
                    updateNode={updateNode}
                    moveItem={moveItem}
                    moveItemUp={handleMoveUp}
                    updateItemDepth={updateItemDepth}
                    removeNode={removeNode} />
            ))}
        </div>
    }

    return childNodes;
}

export default NodeList;
