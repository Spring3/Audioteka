import React from 'react';

export default class NavbarMenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className={this.props.active ? "nav-item active" : "nav-item"}>
        <a className="nav-link" href="#">
          {this.props.text}
        </a>
      </li>
      )
  }
}
