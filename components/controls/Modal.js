import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Button from './../controls/Button';

export default class ModalWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.trigger = this.trigger.bind(this);
  }

  trigger () {
    this.setState({ 
      open: !this.state.open
    });
  }


  render () {
    console.log(this.state);
    return (
      <div>
        <Button className='btn btn-primary btn-block btn-ghost' text='Add new' onclick={this.trigger}/>
        <Modal isOpen={this.state.open} toggle={this.trigger} className={this.props.className}>
          <ModalHeader toggle={this.trigger}>{this.props.title}</ModalHeader>
          <ModalBody>
            {this.props.children}
          </ModalBody>
          <ModalFooter>
            <Button onclick={this.trigger} className="btn btn-primary btn-ghost" text={this.props.confirm}/>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
