import React from 'react';
import { ipcRenderer } from 'electron';
import Navbar from './../controls/Navbar';
import NavbarMenuItem from './../controls/NavbarMenuItem';
import Container from './../controls/Container';
import Form from './../controls/Form';
import FormGroup from './../controls/FormGroup';
import H2 from './../controls/h2';
import Label from './../controls/Label';
import Input from './../controls/Input';
import Button from './../controls/Button';

export default class DBConnectionView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      connected: false,
      message: 'Please enter the name of the database file',
      messageType: '',
      databaseName: ''
    };
  }

  testConnection () {
    const self = this;
    ipcRenderer.on('dbConnect', (event, answer) => {
      let newState;
      if (!answer instanceof Error) {
        newState = { connected: true };
      } else {
        newState = { connected: false, message: 'Failed to connect to a database', messageType: 'danger' };
      }

      self.setState(newState);
    });
    ipcRenderer.send('dbConnect', this.state.databaseName);
  }

  textChanged (dbName) {
    this.setState({
      databaseName: dbName
    });
  }

  render() {
    const formStyles = {
      margin: '5% auto',
      border: 'solid',
      padding: '60px 20px',
      borderRadius: '5px',
      borderWidth: '2px',
      borderColor: 'rgba(2, 17, 16, 0.3)',
      MozBoxShadow: '0px 0px 10px 0px rgba(2, 117, 216, 0.2)',
      boxShadow: '0px 0px 10px 0px rgba(2, 17, 16, 0.2)',
      backgroundColor: 'rgba(2, 17, 16, 0.01)'
    };

    const labelStyle = { marginTop: '40px' };

    const inputStyles = {
      borderWidth: '2px',
      padding: '12px',
      fontSize: '16px'
    };

    const buttonStyles = {
      marginTop: '40px'
    };
    
    return (
      <div className="viewContent">
        <Navbar>
          <NavbarMenuItem text="Home" active="true"/>
          <NavbarMenuItem text="About" />
        </Navbar>
        <Container className="container">
          <Form className="fom-signin col-md-8 col-lg-7" style={formStyles}>
            <H2 className="form-signin-heading" text="SQLite database name"/>
            <Label for="inputConn" type={this.state.messageType} style={labelStyle} text={this.state.message} hidden/>
            <Input type="text" style={inputStyles} id="inputConn" onchange={this.textChanged.bind(this)} className="form-control form-control-success" attributes="autofocus"/>
            <Button className="btn btn-lg btn-primary btn-block" style={buttonStyles} type="submit" text="Connect" onclick={this.testConnection.bind(this)} />
          </Form>
        </Container>
      </div>
    )
  }
};
