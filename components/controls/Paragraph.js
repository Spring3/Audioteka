import React from 'react';

export default class Paragraph extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <p style={this.props.styles}>{this.props.text}</p>
    );
  }
}