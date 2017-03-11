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

  render() {
    return (
      <li className='list-group-item' style={this.props.styles}>{this.props.text}</li>
    );
  }
}

module.exports = {
  List,
  ListItem
}
