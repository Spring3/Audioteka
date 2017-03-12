import React from 'react';
import { Modal, ModalHeader, ModalBody, Input, ModalFooter } from 'reactstrap';
import Button from './../controls/Button';
import Label from './../controls/Label';
import TextField from './../controls/Input';

class ModalRow extends React.Component {
  constructor(props) {
    super(props);
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
          <TextField type="text" className="form-control"/>
        </div>
        <div>
          <Label text="Type" className="form-control-label" styles={labelStyle}/>
          <Input type="select" className="form-control">
            <option>INTEGER</option>
            <option>REAL</option>
            <option>VARCHAR(255)</option>
            <option>BOOLEAN</option>
            <option>DATETIME</option>
            <option>TEXT</option>
            <option>BLOB</option>
          </Input>
        </div>
        <div>
          <Label text="Option" className="form-control-label" styles={labelStyle}/>
          <Input type="select" className="form-control">
            <option>NOT NULL</option>
            <option>UNIQUE</option>
            <option>PRIMARY KEY</option>
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
      open: false,
      contents: []
    };

    this.trigger = this.trigger.bind(this);
    this.addRow = this.addRow.bind(this);
  }

  trigger () {
    this.setState({ 
      open: !this.state.open
    });
  }

  addRow() {
    this.setState({ contents: this.state.contents.concat([this.state.contents.length])});
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
        <Button className='btn btn-primary btn-block btn-ghost' text='Add new' onclick={this.trigger}/>
        <Modal isOpen={this.state.open} toggle={this.trigger} className={this.props.className}>
          <ModalHeader toggle={this.trigger}>{this.props.title}</ModalHeader>
          <ModalBody>
            <div className="form-group" style={formGroupStyle}>
              <Label for="input" text="Table name" className="form-control-label" styles={labelStyle}/>
              <TextField type="text" id="input" className="form-control" attributes="autofocus"/>
            </div>
            {this.state.contents.map(input => <ModalRow key={input}/>)}
          </ModalBody>
          <ModalFooter>
            <Button onclick={this.addRow} className="btn btn-primary btn-ghost" text='Add row'/>
            <Button onclick={this.trigger} className="btn btn-primary btn-ghost" text={this.props.confirm}/>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
