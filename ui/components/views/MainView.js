import React from 'react';
import { ipcRenderer } from 'electron';
import Navbar from './../controls/Navbar';
import NavbarMenuItem from './../controls/NavbarMenuItem';
import Container from './../controls/Container';
import Row from './../controls/Row';
import Panel from './../controls/Panel';
import H4 from './../controls/H4';
import { List, ListItem } from './../controls/List';
import Copyrights from './../controls/Copyrights';
import ModalWindow from './../controls/CreateTableModal';
import WarningModal from './../controls/WarningModal';
import TableContentsPanel from './../controls/TableContentsPanel';

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      tableName: undefined,
      contents: undefined,
      constraints: undefined,
      modalOpen: false,
      warningOpen: false
    };
  }

  componentDidMount() {
    if (!ipcRenderer._events['selectTable']) {
      ipcRenderer.on('selectTable', (event, tableName) => {
        this.setState({ selectedTable: tableName });
        console.log(this.state.selectedTable);
      });
    }
    if (!ipcRenderer._events['getTables']) {
      ipcRenderer.on('getTables', (event, data) => {
        const tablesArray = data.tables.filter((t) => t !== 'sqlite_sequence');
        this.setState({ tables: tablesArray });
      });
    }
    ipcRenderer.send('getTables');
    ipcRenderer.send('selectTable');
  }

  componentWillUnmount() {
    delete ipcRenderer._events['getTables'];
    delete ipcRenderer._events['getTableColumns'];
    delete ipcRenderer._events['dropTable'];
  }

  tableCreated(name) {
    this.setState({
      tables: this.state.tables.concat([name])
    });
  }

  openTable(event) {
    let tableName = event.nativeEvent.target.innerText;
    tableName = tableName.substring(0, tableName.length - 1);
    if (!ipcRenderer._events['getTableColumns']) {
      ipcRenderer.on('getTableColumns', (event, data) => {
        const constraints = {};
        const contents = [];
        data.columns.forEach((element, index) => {
          contents.push(index);
          const constraint = {
            name: element.name,
            type: element.type
          }

          data.fKeys.forEach((key) => {
            if (key.from === element.name) {
              constraint.type = 'REFERENCES';
              constraint.option = key.table;
            }
          });

          if (!constraint.type === 'REFERENCES') {
            if (element.pk === 1) {
              constraint.option = 'PRIMARY KEY';
            } else if (element.notnull === 1) {
              constraint.option = 'NOT NULL';
            } else if (element.cid === 1) {
              constraint.option = 'UNIQUE';
            }
          }
          constraints[index] = constraint;
        });
        this.setState({
          tableName: data.tableName,
          contents: contents,
          constraints: constraints,
          modalOpen: true
        });
      });
    }
    ipcRenderer.send('getTableColumns', { tableName });
  }

  deleteTable (tableName, index = -1) {
    if (index < 0) {
      this.state.tables.forEach((table, i) => {
        if (table === tableName) {
          index = i;
          return;
        }
      });
    }
    if (!ipcRenderer._events['dropTable']){
      ipcRenderer.on('dropTable', (event, data) => {
        if (data.success) {
          const tables = this.state.tables;
          tables.splice(index, 1);
          this.setState({
            tables
          });
        }
      });
    }
    this.setState({
      modalOpen: false,
      warningOpen: true,
      selectedTable: tableName
    });
  }

  confirmDrop (answer) {
    if (answer === true) {
      ipcRenderer.send('dropTable', { tableName: this.state.selectedTable});
    }
    this.setState({
      warningOpen: false,
      selectedTable: undefined,
      modalOpen: false
    });
  }

  reset () {
    this.setState({
      tableName: undefined,
      contents: undefined,
      constraints: undefined,
      modalOpen: false
    });
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
                  {this.state.tables.map((table, index) => <ListItem key={index} id={index} selectedTable={this.state.selectedTable} text={table} styles={listItemStyle} onClick={this.openTable.bind(this)} deleteTable={this.deleteTable.bind(this)}/>)}
                </List>
              </Panel>
              <ModalWindow title="New table" tables={this.state.tables} open={this.state.modalOpen} action={this.deleteTable.bind(this)} tableName={this.state.tableName} contents={this.state.contents} constraints={this.state.constraints} reset={this.reset.bind(this)} id="createTable" onCreate={this.tableCreated.bind(this)} confirm="Create"></ModalWindow>
              <WarningModal open={this.state.warningOpen} message='Are you sure you want to drop the table?' action={this.confirmDrop.bind(this)}/>
            </Panel>
            <Panel cols='offset-sm-1 col-sm-8' styles={panelStyle}>
              <TableContentsPanel/>
            </Panel>
          </Row>
        </Container>
        <Copyrights/>
      </div>
    );
  }
}
