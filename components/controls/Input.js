import React from 'react';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
  }

  textChange (event) {
    this.props.onchange(event.target.value);
  }

  render() {
    return (
      <input type={this.props.type} style={this.props.style} onChange={this.textChange.bind(this)} id={this.props.id} className={this.props.className} placeholder={this.props.placeholder} required/>
    ); 
  }
}