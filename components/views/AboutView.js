import React from 'react';
import { ipcRenderer } from 'electron'; 
import Navbar from './../controls/Navbar';
import NavbarMenuItem from './../controls/NavbarMenuItem';
import Container from './../controls/Container';
import Image from './../controls/Image';
import H2 from './../controls/H2';
import H3 from './../controls/H3';
import Paragraph from './../controls/Paragraph';
import Row from './../controls/Row';
import Copyrights from './../controls/Copyrights';

export default class AboutView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      vd: '',
      gd: '',
      ma: ''
    };
    const self = this;
    if (!ipcRenderer._events['loadImgs']) {
      ipcRenderer.on('loadImgs', (event, data) => {
        self.setState(data);
      });
    }
    ipcRenderer.send('loadImgs');
  }

  componentWillUnmount() {
    delete ipcRenderer._events['loadImgs'];
  }

  render() {
    const textAlign = {
      textAlign: 'center',
      marginTop: '10%',
      fontFamily: 'Modeka',
      'font-weight': 'bold'
    };

    const headerText = {
      marginTop: '10px'
    };

    const marginedHeader = {
      margin: '60px auto 0px auto',
      fontFamily: 'Modeka'
    };

    const rowStyle = {
      borderTop: '2px solid rgb(233, 241, 244)'
    };

    const pStyle = {
      borderBottom: 'solid 2px rgb(233, 241, 244)'
    };

    return (
      <div className="viewContent">
        <Navbar>
          <NavbarMenuItem to='/' text="Home" />
          <NavbarMenuItem to='/about' text="About" active="true"/>
        </Navbar>
        <Container className="container-fluid">
          <Row>
            <H2 text='CREATED BY:' styles={marginedHeader}/>
          </Row>
          <Row styles={rowStyle}>
            <Image cols='col-sm-4' src={this.state.gd} width='160' height='160' styles={textAlign}>
              <H3 text='Govorov Denis' styles={headerText}/>
              <Paragraph text='Student -> IA-62c (FIOT)' styles={pStyle}/>
            </Image>
            <Image cols='col-sm-4' src={this.state.vd} width='160' height='160' styles={textAlign}>
              <H3 text='Vasylenko Daniyil' styles={headerText}/>
              <Paragraph text='Student -> IA-62c (FIOT)' styles={pStyle}/>
            </Image>
            <Image cols='col-sm-4' src={this.state.ma} width='160' height='160' styles={textAlign}>
              <H3 text='Musatkin Alexandr' styles={headerText}/>
              <Paragraph text='Student -> IA-62c (FIOT)' styles={pStyle}/>
            </Image>
          </Row>
        </Container>
        <Copyrights/>
      </div>
    );
  }
}
