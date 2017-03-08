import React from 'react';

export default class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row" style={this.props.styles}>
        {this.props.children}
      </div>
    );
  }
}