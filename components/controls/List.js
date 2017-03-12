import React from 'react';

class List extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const className = `list-group ${this.props.className}`;
    return (
      <ul className={className} style={this.props.style}>
        {this.props.children}
      </ul>
    );
  }
}

class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    this.props.onClick(e);
  }

  deleteClick(e) {
    e.stopPropagation();
    this.props.deleteTable(this.props.text, this.props.id);
  }

  render() {
    return (
      <li className='list-group-item' style={this.props.styles} onClick={this.handleClick.bind(this)}>{this.props.text}<span className='btn-delete' onClick={this.deleteClick.bind(this)}>&times;</span></li>
    );
  }
}

module.exports = {
  List,
  ListItem
}
