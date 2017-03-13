import React from 'react';
import { Modal, ModalHeader, ModalBody, Input, ModalFooter, Button } from 'reactstrap';
import Label from './../controls/Label';
import TextField from './../controls/Input';
import { ipcRenderer } from 'electron'; 

class ModalRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: this.props.name || '',
      type: this.props.type || '',
      option: this.props.option || '',
      options: this.props.options || ['', 'NOT NULL', 'UNIQUE', 'PRIMARY KEY']
    };
    setTimeout(() => {
      this.props.handler(this.state.id, this.state.name, this.state.type, this.state.option);
    }, 500);
  }

  onConstraintNameChange(val) {
    this.setState({ name: val.nativeEvent.target.value });
    this.props.handler(this.state.id, val.nativeEvent.target.value, this.state.type, this.state.option);
  }

  onConstraintTypeChange(val) {
    const options = val.nativeEvent.target.value === 'REFERENCES' ? this.props.tables : ['', 'NOT NULL', 'UNIQUE', 'PRIMARY KEY'];
    this.setState({ 
      type: val.nativeEvent.target.value,
      options
     });
    this.props.handler(this.state.id, this.state.name, val.nativeEvent.target.value, this.state.option);
  }

  onConstraintOptionChange(val) {
    this.setState({ option: val.nativeEvent.target.value });
    this.props.handler(this.state.id, this.state.name, this.state.type, val.nativeEvent.target.value);
  }

  render () {
    const formGroupStyle = {
      display: 'inline-block !important'
    };

    const labelStyle = {
      justifyContent: 'flex-start !important'
    };

    return (
      <div className="form-group modal-form" style={formGroupStyle}>
        <div>
          <Label text="Constraint" className="form-control-label" styles={labelStyle}/>
          <Input className="form-control" value={this.state.name} disabled={this.props.disabled} onChange={this.onConstraintNameChange.bind(this)}/>
        </div>
        <div>
          <Label text="Type" className="form-control-label" styles={labelStyle}/>
          <Input type="select" disabled={this.props.disabled} value={this.state.type} className="form-control" onChange={this.onConstraintTypeChange.bind(this)}>
            <option></option>
            <option>INTEGER</option>
            <option>REAL</option>
            <option>VARCHAR(255)</option>
            <option>BOOLEAN</option>
            <option>DATETIME</option>
            <option>TEXT</option>
            <option>BLOB</option>
            <option>REFERENCES</option>
          </Input>
        </div>
        <div>
          <Label text="Option" className="form-control-label" styles={labelStyle}/>
          <Input type="select" className="form-control" value={this.state.option} disabled={this.props.disabled} onChange={this.onConstraintOptionChange.bind(this)}>
            {this.state.options.map((optionLiteral, index) => <option key={index}>{optionLiteral}</option>)}
          </Input>
        </div>
      </div>
    );
  }
}

export default class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open || false,
      tableName: this.props.tableName || false,
      contents: this.props.contents || [],
      constraints: this.props.constraints || {},
      exists: this.props.exists || false
    };

    this.trigger = this.trigger.bind(this);
    this.addRow = this.addRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.state.open) {
      this.setState({
        open: nextProps.open,
        tableName: nextProps.tableName,
        contents: nextProps.contents,
        constraints: nextProps.constraints,
        exists: true
      });
    }
  }

  trigger () {
    if (this.state.open) {
      this.setState({
        open: false,
        tableName: '',
        contents: [],
        constraints: {},
        exists: false
      });
      if (this.props.reset) {
        this.props.reset();
      }
    } else {
      this.setState({
        open: true
      });
    }
  }

  addRow() {
    this.setState({ contents: this.state.contents.concat([this.state.contents.length])});
  }

  constraintChanged(id, name, type, option) {
    const newConstraint = {
      name,
      type,
      option
    };
    const savedConstraints = this.state.constraints;
    savedConstraints[id] = newConstraint;
    this.setState({
      constraints: savedConstraints
    });
  }

  columnNameChanged(val) {
    this.setState({
      tableName: val.nativeEvent.target.value
    });
  }

  create() {
    const data = {
      tableName: this.state.tableName,
      constraints: this.state.constraints,
      length: this.state.contents.length
    };

    ipcRenderer.on('createTable', (event, data) => {
      if (data.success) {
        this.props.onCreate(this.state.tableName);
        this.trigger();
      } else {
        this.setState({ error: true });
      }
    });
    ipcRenderer.send('createTable', data);
  }

  deleteTable() {
    this.props.action(this.state.tableName);
    trigger();
  }

  render () {
    const formGroupStyle = {
      display: 'inline-block !important'
    };

    const labelStyle = {
      justifyContent: 'flex-start !important'
    };

    return (
      <div>
        <Button className='btn btn-primary btn-block btn-ghost' onClick={this.trigger}>Add New</Button>
        <Modal isOpen={this.state.open} toggle={this.trigger} className={this.props.className}>
          <ModalHeader toggle={this.trigger}>{this.state.exists ? this.state.tableName : this.props.title}</ModalHeader>
          <ModalBody>
            <div className="form-group" style={formGroupStyle}>
              <Label for="input" text="Table name" className="form-control-label" styles={labelStyle}/>
              <Input id="input" value={this.state.tableName || ''} disabled={this.state.exists} onChange={this.columnNameChanged.bind(this)}/>
            </div>
            {this.state.contents.map((input, index) => {
              if (index === 0) {
                return <ModalRow key={index} id={index} name='id' type='INTEGER' option='PRIMARY KEY' handler={this.constraintChanged.bind(this)} error={this.state.error} disabled="true"/>
              }
              const constraint = this.state.constraints[index];
              if (constraint) {
                return <ModalRow key={input} id={input} name={constraint.name} tables={this.props.tables} options={this.props.tables} disabled={this.state.exists} type={constraint.type} option={constraint.option} handler={this.constraintChanged.bind(this)} error={this.state.error}/>
              } else {
                return <ModalRow key={input} id={input} handler={this.constraintChanged.bind(this)} tables={this.props.tables} disabled={this.state.exists} error={this.state.error}/>
              }
            })}
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.deleteTable.bind(this)} outline color="danger" hidden={!this.state.exists}>Delete Table</Button>
            <Button onClick={this.addRow} className="btn btn-primary btn-ghost" disabled={this.state.exists}>Add row</Button>
            <Button onClick={this.create.bind(this)} outline color="success" disabled={this.state.exists}>{this.props.confirm}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
