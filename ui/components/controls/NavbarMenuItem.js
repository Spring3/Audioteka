import React from 'react';
import { Link } from 'react-router';

export default class NavbarMenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className={this.props.active ? "nav-item active" : "nav-item"}>
        <Link className="nav-link" to={this.props.to}>{this.props.text}</Link>
      </li>
      )
  }
}
