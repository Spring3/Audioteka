import React from 'react';

export default class FormGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className={this.state.groupType}>
        {this.props.children}
      </div>
    )
  }
}