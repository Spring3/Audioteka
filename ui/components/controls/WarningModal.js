import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export default class WarningModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.state.open) {
      this.setState({
        open: nextProps.open
      });
    }
  }

  trigger () {
    this.setState({
      open: !this.state.open
    });
  }

  handleClick(e, answer) {
    this.props.action(e);
    this.trigger();
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.open} toggle={this.trigger}>
          <ModalHeader color='warning' toggle={this.handleClick.bind(this, false)}>Warning</ModalHeader>
          <ModalBody>
            {this.props.message}
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.handleClick.bind(this, false)}>Cancel</Button>
            <Button color='danger' onClick={this.handleClick.bind(this, true)}>Yes</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}