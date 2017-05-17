import React from 'react';
import { render } from 'react-dom';

import main from '../styles'; // eslint-disable-line no-unused-vars

import SortableTree from './sortable-tree';

const colors = ['blue', 'gray', 'lightblue', 'red']
const colorsTwo = ['white', 'yellow', 'orange'];

let DATA_SET = Array(4)
    .fill({label: ''})
    .map( (item, index) => {
        let menuItems = (index % 5 === 0) ?
            Array(3).fill({label: ''})
            .map( (t, i) => {
                return Object.assign({}, t, {label: `Label #${i + 1}`, color: colorsTwo[i]});
            }) : [];
        return Object.assign({}, item, {label: `Label #${index + 1}`, color: colors[index], menuItems: menuItems});
    });

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: DATA_SET
        }
    }

    handleChange(items) {
        this.setState({data: items});
    }

    render() {
        return (
            <SortableTree
                onChange={ nodes => this.handleChange(nodes) }
                dataList={this.state.data}
                levelOffset={22}
                levels={3}
                component={ props => (
                    <div className="test-component" style={{background: props.data.color}}>
                        <p>{props.data.label}</p>
                        { props.depth > 0 ? <em>{`Child Node of ${props.parentId}`}</em> : <strong>Parent Node</strong>}
                    </div>
                )}
                />
        )
    }
}

render((
    <App />
), document.getElementById('app'));
