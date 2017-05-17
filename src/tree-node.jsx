import React from 'react';
//import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import NodeList from './node-list';

const uid = () => {return `${Math.random().toString(34).slice(2)}`};

//ItemSource Functions/Connections
//Details: Data and behavior that effectively is
//made available from a node while dragging

const itemSource = {
    beginDrag(props) {
        return {
            index: props.index,
            depth: props.depth,
            parentId: props.parentId,
            parentIndex: props.parentIndex,
            data: props.data,
            offset: {x: 0, y: 0},
            setOffset: false
        };
    }
}

function connectSource(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

//ItemTarget Functions/Connections
//Details: Data and behavior that effectively is
//made available from a target node being hovered over or dropped on

const itemTarget = {
    hover(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const dragDepth = monitor.getItem().depth;
        const dragParentIndex = monitor.getItem().parentIndex;
        const dragData = monitor.getItem().data;

        const hoverIndex = props.index;
        const hoverDepth = props.depth;

        if(typeof props.data === 'undefined') { return; }

        const hoverChildNodeCount = (props.data.menuItems) ? props.data.menuItems.length : 0;
        if(!monitor.getItem().setOffset) {
            monitor.getItem().offset = monitor.getInitialClientOffset();
            monitor.getItem().setOffset = true;
        }
        const dragOffset = monitor.getItem().offset;

        const x = (monitor.getClientOffset().x - dragOffset.x);
        const y = monitor.getDifferenceFromInitialOffset().y;

        if(x >= props.offset && hoverIndex > 0 && dragDepth === hoverDepth && Math.abs(y) < 10) {
            monitor.getItem().index = props.updateItemDepth(dragIndex, dragIndex - 1, dragDepth) - 1;
            monitor.getItem().depth = hoverDepth + 1;
            monitor.getItem().offset = monitor.getClientOffset();
            return;
        }

        if(x <= -props.offset && ((dragDepth - 1) === hoverDepth) && (dragIndex === (hoverChildNodeCount - 1)) && Math.abs(y) < 10) {
            props.moveItemUp(dragData, dragIndex, dragParentIndex, dragDepth);
            monitor.getItem().index = hoverIndex + 1;
            monitor.getItem().depth = hoverDepth;
            monitor.getItem().offset = monitor.getClientOffset();
            return;
        }

        //cannot replace with parent or self
        if(hoverDepth !== dragDepth || dragIndex === hoverIndex) {
            return;
        }

        // if(dragDepth === hoverDepth && hoverChildNodeCount > 0) {
        //     props.updateItemDepth(dragIndex, hoverIndex);
        //     monitor.getItem().depth = hoverDepth + 1;
        //     monitor.getItem().index = hoverChildNodeCount;
        //     return;
        // }

        props.moveItem(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
}

function connectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver() && monitor.isOver({ shallow: true }),
        hoverItem: monitor.getItem()
    }
}


//Class Definition
class TreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: uid()
        }
    }

    handleChange(items) {
        const update = Object.assign({}, this.props.data, {menuItems: items});
        this.props.updateNode(update, this.props.index);
    }

    updateNode(data) {
        this.props.updateNode(data, this.props.index);
    }

    removeNode() {
        this.props.removeNode(this.props.index);
    }

    render() {

        const {
            component,
            data,
            index,
            depth,
            offset,
            parentId,
            moveItemUp,

            //Drag n Drop related props
            connectDragSource,
            connectDragPreview,
            connectDropTarget,
            isDragging,
            isOverCurrent
            //isOver,
            //hoverItem
        } = this.props;

        const Node = component;
        const dragging = isDragging ? 'dragging' : 'idle';
        const dragOver = (isOverCurrent) ? 'drag-over' : '';

        return connectDragPreview(connectDropTarget(
            <div className={[`node depth-${depth}`, dragging, dragOver].join(' ').trim()}>
                    {connectDragSource(
                        <div>
                        <Node
                            data={data}
                            index={index}
                            depth={depth}
                            parentId={parentId}
                            uid={this.state.uid}
                            dragging={dragging}
                            dragOver={dragOver}
                            removeItem={() => this.removeNode() }
                            updateItem={ data => this.updateNode(data) } />
                        </div>
                    )}
                    <NodeList
                        hide={isDragging}
                        parentIndex={index}
                        parentId={this.state.uid}
                        data={data.menuItems || []}
                        depth={depth + 1}
                        offset={offset}
                        component={component}
                        moveItemUp={moveItemUp}
                        onChange={ update => this.handleChange(update)} />
            </div>
        ))
    }
}

TreeNode.defaultProps = {
    data: {
        menuItems: []
    }
}


//Drag and Drop ID
const UID = 'TREE_NODE';

export default DropTarget(UID, itemTarget, connectTarget)(DragSource(UID, itemSource, connectSource)(TreeNode));
