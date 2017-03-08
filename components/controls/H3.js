import React from 'react';

export default class H3 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h3 className={this.props.className} style={this.props.styles}>{this.props.text}</h3>
    );
  }
}