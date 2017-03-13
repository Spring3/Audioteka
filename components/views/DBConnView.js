import React from 'react';
import { ipcRenderer } from 'electron';
import { withRouter } from 'react-router';
import { Button } from 'reactstrap';
import Navbar from './../controls/Navbar';
import NavbarMenuItem from './../controls/NavbarMenuItem';
import Container from './../controls/Container';
import Form from './../controls/Form';
import FormGroup from './../controls/FormGroup';
import H2 from './../controls/H2';
import Label from './../controls/Label';
import Input from './../controls/Input';
import Copyrights from './../controls/Copyrights';

class DBConnectionView extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      message: 'Please enter the name of the database file',
      messageType: '',
      databaseName: window.localStorage.dbname || ''
    };
  }

  componentWillUnmount() {
    delete ipcRenderer._events['dbConnect'];
  }

  testConnection () {
    const self = this;
    if (!ipcRenderer._events['dbConnect']) {
      ipcRenderer.on('dbConnect', (event, answer) => {
        if (answer.success) {
          window.localStorage.dbname = this.state.databaseName;
          this.props.router.push('/main');
        } else {
          const newState = { message: `Failed to connect to a database: ${answer.message}`, messageType: 'danger' };
          self.setState(newState);
        }
      });
    }
    ipcRenderer.send('dbConnect', this.state.databaseName);
  }

  textChanged (dbName) {
    this.setState({
      databaseName: dbName
    });
  }

  render() {
    const formStyles = {
      margin: '40px auto',
      padding: '40px 20px',
      backgroundColor: 'white',
      border: 'solid 2px #E9F1F4',
      borderRadius: '3px'
    };

    const labelStyle = { marginTop: '40px' };

    const inputStyles = {
      borderWidth: '2px',
      fontSize: '16px'
    };

    const buttonStyles = {
      marginTop: '40px'
    };
    
    return (
      <div className="viewContent">
        <Navbar>
          <NavbarMenuItem to='/' text="Home" active="true"/>
          <NavbarMenuItem to='/about' text="About" />
        </Navbar>
        <Container className="container">
          <Form className="fom-signin col-8 col-sm-7 col-md-6 col-lg-5" style={formStyles}>
            <H2 className="form-signin-heading" text="Connection"/>
            <Label for="inputConn" type={this.state.messageType} styles={labelStyle} text={this.state.message} hidden/>
            <Input type="text" style={inputStyles} id="inputConn" value={this.state.databaseName} onchange={this.textChanged.bind(this)} className="form-control wide" attributes="autofocus"/>
            <Button className="btn btn-lg btn-primary btn-block btn-ghost" style={buttonStyles}onClick={this.testConnection.bind(this)}>Connect</Button>
          </Form>
        </Container>
        <Copyrights/>
      </div>
    );
  }
};

const decoratedView = withRouter(DBConnectionView);

DBConnectionView.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}

module.exports = decoratedView;

