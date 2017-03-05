import React from 'react';

export default class FormGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupType: props.type ? 'form-group has-' + props.type : 'form-group',
      inputType: props.type ? 'form-control form-control-' + props.type : 'form-control',
    };
  }

  render () {
    return (
      <div className={this.state.groupType}>
        
        <label className="form-control-label" htmlFor={this.props.id}>{this.props.labelText}</label>
        <input type="text" className={this.state.inputType} id={this.props.id} placeholder={this.props.placeholder}/>
        <div className="form-control-feedback">{this.props.feedback || ''}</div>
        <button type="button" className="btn btn-primary">Connect</button>
      </div>
    )
  }
}