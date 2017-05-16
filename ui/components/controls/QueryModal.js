import React from 'react';
import { ipcRenderer } from 'electron';
import Textarea from './Textarea';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import TableContentsPanel from './TableContentsPanel';

class QueryModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      nestedModal: false
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    if (!ipcRenderer._events['customQuery']) {
      ipcRenderer.on('customQuery', (event, tableName) => {
        this.toggle();
      });
    }

    if (!ipcRenderer._events['queryExecution:res']) {
      ipcRenderer.on('queryExecution:res', (event, results) => {
        let type;
        if (Array.isArray(results)) {
          type = 'array';
        } else if (results instanceof Error) {
          type = 'error';
        } else {
          type = 'object'
        }
        this.setState({
          type,
          result: results
        }, () => {
          this.toggleNested();
        });
      });
    }
  }

  componentWillUnmount() {
    delete ipcRenderer._events['queryExecution:res'];
    delete ipcRenderer._events['customQuery'];
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal
    });
  }

  executeQuery() {
    ipcRenderer.send('queryExecution', this.refs.textarea.state.text);
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle.bind(this)}>
          <ModalHeader toggle={this.toggle}>SQL Query</ModalHeader>
          <ModalBody>
            <Label for="textarea">Please enter your SQL query here:</Label>
            <Textarea type="textarea" ref="textarea"/>
            <Modal isOpen={this.state.nestedModal} size="large" className="modal-large" toggle={this.toggleNested.bind(this)}>
              <ModalHeader>Query Results:</ModalHeader>
                <CustomModalBody type={this.state.type} result={this.state.result}/>
              <ModalFooter>
                <Button color="primary" onClick={this.toggleNested.bind(this)}>OK</Button>{' '}
              </ModalFooter>
            </Modal>
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


class CustomModalBody extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    switch(this.props.type) {
      case 'array': {
        return (
          <ModalBody>
            <TableContentsPanel main={false} rows={this.props.result} minHeight={300}/>
          </ModalBody>
        )
      }
      default: {
        return (
          <ModalBody>
            {this.props.result || '0 Entries changed'}
          </ModalBody>
        )
      }
    }
  }
}

Modal.defaultProps = {
  isOpen: false
};
export default QueryModal;
