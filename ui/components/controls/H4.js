import React from 'react';

export default class H4 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h4 className={this.props.className} style={this.props.styles}>{this.props.text}</h4>
    );
  }
}
