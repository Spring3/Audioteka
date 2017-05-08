import React from 'react';
import ReactDataGrid from 'react-data-grid';
import update from 'react-addons-update';
import { Toolbar } from 'react-data-grid-addons';
import { ipcRenderer } from 'electron';

export default class TableContentsPanel extends React.Component {
  constructor(props) {
    super(props);
    // actually we will not pass those as props. Instead we will just pass the tableName and query type
    if (this.props.main) {
      this.state = {
        columns: [],
        rows: []
      };
    } else {
      const columns = [];
      let indexOfId = -1;
      for(const key of Object.keys(this.props.rows[0])) {
        const id = columns.push({
          key,
          name: key,
          editable: false,
          resizable: true
        }) - 1;
        if (key === 'id'){
          indexOfId = id;
        }
      }
      if (indexOfId !== -1) {
        const buf = columns[0];
        columns[0] = columns[indexOfId];
        columns[indexOfId] = buf;
      }
      this.state = {
        columns,
        rows: this.props.rows
      };
    }

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.main) { 
      if (!ipcRenderer._events['getTableContents']) {
        ipcRenderer.on('getTableContents', (event, data) => {
          const columns = data.columns.map((c) => ({ key: c.name, name: c.name, editable: false, resizable: true }));
          this.setState({
            columns,
            rows: data.data
          });
        });
      }

      if (this.props.tableName !== nextProps.tableName) {
        if (nextProps.tableName) {
          ipcRenderer.send('getTableContents', { tableName: nextProps.tableName });
        }
      }
    }
  }

  componentWillUnmount() {
    delete ipcRenderer._events['getTableContents'];
  }

  rowGetter(i) {
    return this.state.rows[i];
  }

  handleGridRowsUpdated({ fromRow, toRow, updated }) {
    if (this.state.rows) {
      let rows = this.state.rows.slice();

      for (let i = fromRow; i <= toRow; i++) {
        let rowToUpdate = rows[i];
        let updatedRow = update(rowToUpdate, {$merge: updated});
        rows[i] = updatedRow;
      }

      this.setState({ rows });
    }
  }

  handleAddRow({ newRowIndex }) {
    const newRow = {
      value: newRowIndex
    };

    let rows = this.state.rows.slice();
    rows = update(rows, {$push: [newRow]});
    this.setState({ rows });
  }

  handleRowClick(rowIndex, row) {
    if (rowIndex >= 0) {
      ipcRenderer.send('updateRow', { index: rowIndex, row });
    }
  }

  render() {
    if (!this.props.main) {
      return (
        <ReactDataGrid
          columns={this.state.columns}
          rowGetter={this.rowGetter.bind(this)}
          onRowClick={this.handleRowClick.bind(this)}
          rowsCount={this.state.rows.length}
          minHeight={this.props.minHeight || 490}
        />
      );
    } else {
      return (
        <ReactDataGrid
          enableCellSelect={true}
          columns={this.state.columns}
          rowGetter={this.rowGetter.bind(this)}
          onRowClick={this.handleRowClick.bind(this)}
          rowsCount={this.state.rows ? this.state.rows.length : 0}
          onGridRowsUpdated={this.gridUpdate}
          toolbar={<Toolbar onAddRow={this.handleAddRow.bind(this)}/>}
          minHeight={this.props.minHeight || 490}
        />
      );
    }
  }
}

