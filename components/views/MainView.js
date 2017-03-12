import React from 'react';
import Navbar from './../controls/Navbar';
import NavbarMenuItem from './../controls/NavbarMenuItem';
import Container from './../controls/Container';
import Row from './../controls/Row';
import Panel from './../controls/Panel';
import H4 from './../controls/H4';
import { List, ListItem } from './../controls/List';
import Copyrights from './../controls/Copyrights';
import Button from './../controls/Button';
import ModalWindow from './../controls/Modal';

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const panelStyle = {
      marginTop: '20px',
      background: 'white',
      border: '2px solid rgb(233, 241, 244)',
      borderRadius: '5px',
      minHeight: '250px',
      padding: '0px !important'
    };

    const innerPanelStyle = {
      background: 'white',
      padding: '0px !important',
      height: '200px',
      overflowY: 'scroll',
      overflowX: 'hidden',
      width: '100%'
    }

    const headerStyle = {
      color: '#626973',
      padding: '10px 5px',
      border: 'none',
      borderBottom: '2px solid rgb(233, 241, 244)',
      margin: '0'
    };

    const listStyle = {
      textAlign: 'center'
    };

    const listItemStyle = {
      border: 'none',
      borderTop: '2px solid rgb(233, 241, 244)',
      borderRadius: '0px',
      textAlign: 'center !important',
      flexDirection: 'column'
    };

    return (
      <div className="viewContent">
        <Navbar>
          <NavbarMenuItem to='/main' text="Home" active="true"/>
          <NavbarMenuItem to='/about' text="About"/>
        </Navbar>
        <Container className="container">
          <Row>
            <Panel cols='col-sm-4 col-md-3 panel-fluid' styles={panelStyle}>
              <H4 text='Tables' styles={headerStyle}/>
              <Panel styles={innerPanelStyle}>
                <List className= 'tables-list' style={listStyle}>
                  <ListItem text="One" styles={listItemStyle}/>
                  <ListItem text="Two" styles={listItemStyle}/>
                  <ListItem text="Three" styles={listItemStyle}/>
                  <ListItem text="Four" styles={listItemStyle}/>
                  <ListItem text="Five" styles={listItemStyle}/>
                  <ListItem text="Six" styles={listItemStyle}/>
                  <ListItem text="Seven" styles={listItemStyle}/>
                </List>
              </Panel>
              <ModalWindow title="New table" id="createTable" confirm="Create"></ModalWindow>
            </Panel>
            <Panel cols='offset-sm-1 col-sm-8' styles={panelStyle}>
            </Panel>
          </Row>
        </Container>
        <Copyrights/>
      </div>
    );
  }
}
