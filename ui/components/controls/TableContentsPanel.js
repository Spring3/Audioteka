import React from 'react';
import ReactDataGrid from 'react-data-grid';
import { ipcRenderer } from 'electron';

export default class TableContentsPanel extends React.Component {
  constructor(props) {
    super(props);
    // actually we will not pass those as props. Instead we will just pass the tableName and query type
    this.state = {
      columns: [],
      rows: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tableName !== nextProps.tableName) {
      if (!ipcRenderer._events['getTableContents']) {
        ipcRenderer.on('getTableContents', (event, data) => {
          this.setState({
            columns: data.columns.map((c) => ({ key: c.name, name: c.name, editable: true })),
            rows: data.data
          });
        });
      }
      if (nextProps.tableName) {
        ipcRenderer.send('getTableContents', { tableName: nextProps.tableName });
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
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = React.addons.update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  }

  render() {
    return (
      <ReactDataGrid
        enableCellSelect={true}
        columns={this.state.columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        onGridRowsUpdated={this.gridUpdate}
        minHeight={290}
      />);
  }
}
