import React from 'react';
import ReactDataGrid from 'react-data-grid';

export default class TableContentsPanel extends React.Component {
  constructor(props) {
    super(props);
    // actually we will not pass those as props. Instead we will just pass the tableName and query type
    this.state = {
      columns: this.props.columns || [],
      rows: this.props.data || []
    };
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
