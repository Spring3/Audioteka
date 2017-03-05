import React from 'react';
import Navbar from './../controls/Navbar';
import NavbarMenuItem from './../controls/NavbarMenuItem';
import Container from './../controls/Container';
import Form from './../controls/Form';
import H2 from './../controls/h2';
import Label from './../controls/Label';
import Input from './../controls/Input';
import Button from './../controls/Button';

export default class DBConnectionView extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    const formStyles = {
      margin: '20% auto',
      border: 'solid',
      padding: '60px 20px',
      'border-radius': '5px',
      'border-width': '2px',
      'border-color': 'rgba(2, 17, 16, 0.3)',
      '-moz-box-shadow': '0px 0px 10px 0px rgba(2, 117, 216, 0.2)',
      'box-shadow': '0px 0px 10px 0px rgba(2, 17, 16, 0.2)',
      'background-color': 'rgba(2, 17, 16, 0.01)'
    };

    const inputStyles = {
      'border-width': '2px',
      'margin-top': '40px',
      'padding': '12px',
      'font-size': '16px'
    }

    const buttonStyles = {
      'margin-top': '40px'
    }

    return (
      <div className="viewContent">
        <Navbar>
          <NavbarMenuItem text="Home" active="true"/>
          <NavbarMenuItem text="About" />
        </Navbar>
        <Container className="container">
          <Form className="fom-signin col-md-8 col-lg-7" style={formStyles}>
            <H2 className="form-signin-heading" text="Connection URL"/>
            <Label for="inputConn" className="sr-only" text="Oracle DB connection string"/>
            <Input type="text" style={inputStyles} id="inputConn" className="form-control form-control-success" placeholder="Oracle DB URL" attributes="autofocus"/>
            <Button className="btn btn-lg btn-primary btn-block" style={buttonStyles} type="submit" text="Connect" />
          </Form>
        </Container>
      </div>
    )
  }
};
