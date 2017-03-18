import React from 'react';

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text || ''
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.value) {
      nextState.text = nextProps.value
    }
  }

  textChange (event) {
    this.setState({
      text: event.target.value
    })
    this.props.onchange(event.target.value);
  }

  render() {
    return (
      <input type={this.props.type} style={this.props.style} value={this.state.text} onChange={this.textChange.bind(this)} id={this.props.id} className={this.props.className} placeholder={this.props.placeholder} required/>
    ); 
  }
}