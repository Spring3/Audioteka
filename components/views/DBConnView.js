import React from 'react';
import Navbar from './../controls/Navbar';
import NavbarMenuItem from './../controls/NavbarMenuItem';
import Container from './../controls/Container';
import Form from './../controls/Form';
import FormGroup from './../controls/FormGroup';

export default class DBConnectionView extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="viewContent">
        <Navbar>
          <NavbarMenuItem text="Home" active="true"/>
          <NavbarMenuItem text="About" />
        </Navbar>
        <Container type="container">
          <Form>
            <FormGroup id='dbConnString' labelText='Postgresql Database Connection String' type="" placeholder="postgres://<username>:<password>@<host>:<port>/<schema>"/>
          </Form>
        </Container>
      </div>
    )
  }
};
