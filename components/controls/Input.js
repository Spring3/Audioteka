import React from 'react';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <input type={this.props.type} style={this.props.style} id={this.props.id} className={this.props.className} placeholder={this.props.placeholder} required/>
    ); 
  }
}