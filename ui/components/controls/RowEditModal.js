import React from 'react';
import { ipcRenderer } from 'electron';
import Textarea from './Textarea';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';

class RowEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    if (!ipcRenderer._events['updateRow']) {
      ipcRenderer.on('updateRow', (event, data) => {
        this.toggle();
        this.setState({ rowIndex: data.index, row: data.row });
      });
    }
  }

  componentWillUnmount() {
    delete ipcRenderer._events['updateRow'];
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>SQL Query</ModalHeader>
          <ModalBody>
            <Label for="textarea">Please enter your SQL query here:</Label>
            <Textarea type="textarea" ref="textarea"/>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.executeQuery.bind(this)}>Execute</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

Modal.defaultProps = {
  isOpen: false
};
export default RowEditModal;
