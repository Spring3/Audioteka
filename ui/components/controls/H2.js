import React from 'react';

export default class H2 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h2 className={this.props.className} style={this.props.styles}>{this.props.text}</h2>
    );
  }
}