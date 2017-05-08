import React from 'react';

class Textarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text
    }

    this.textChanged = this.textChanged.bind(this);
  }

  textChanged (event) {
    const text = event.target.value;
    this.setState({ text });
    if (this.props.onChange) {
      this.props.onChange(text);
    }
  }

  render() {
    return (
      <textarea className="form-control" rows="5" id="query" onChange={this.textChanged}></textarea>
    );
  }
}

Textarea.defaultProps = {
  text: ''
}

export default Textarea;
