import React from 'react';
import ReactDataGrid from 'react-data-grid';
import update from 'react-addons-update';
import { Toolbar } from 'react-data-grid-addons';
import { ipcRenderer } from 'electron';
import TableRowPopup from './TableRowPopup';

export default class TableContentsPanel extends React.Component {
  constructor(props) {
    super(props);
    // actually we will not pass those as props. Instead we will just pass the tableName and query type
    if (this.props.main) {
      this.state = {
        columns: [],
        rows: [],
        modalOpen: false
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
        this.setState({
          tableName: nextProps.tableName
        });
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
    this.setState({ modalOpen: false, rows });
  }

  handleRowClick(rowIndex, row) {
    const keys = Object.keys(row);
    let isBlank = true;
    for(const key of keys) {
      if (row[key] !== '') {
        isBlank = false;
      }
    }
    if ((keys.length === 1 && keys[0] === 'value') || isBlank) {
      delete row.value;
      for(const val of this.state.columns) {
        row[val.name] = '';
      }
      this.setState({
        modalOpen: true,
        rowIndex,
        row,
        blank: true
      });
      return;
    }
    this.setState({
      modalOpen: true,
      rowIndex,
      row,
      blank: false
    });
  }

  updateRow(index, newRow) {
    const rows = this.state.rows;
    rows[index] = newRow;
    this.setState({ rows });
  }

  deleteRow(index) {
    let rows = this.state.rows;
    rows = rows.splice(index, 1);
    this.setState({ rows });
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
        <div>
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
          <TableRowPopup isOpen={this.state.modalOpen} updateRow={this.updateRow.bind(this)} deleteRow={this.deleteRow.bind(this)} row={this.state.row} rowIndex={this.state.rowIndex} tableName={this.state.tableName} blank={this.state.blank} cols={this.state.columns}/>
        </div>
      );
    }
  }
}

