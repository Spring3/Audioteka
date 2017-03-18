import React from 'react';

export default class Copyrights extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const styles = {
      position: 'fixed',
      bottom: '0',
      textAlign: 'center',
      width: '100%',
      borderTop: '2px solid rgb(233, 241, 244)',
      borderBottom: '2px solid rgb(233, 241, 244)',
      background: 'white',
      height: '30px'
    };
    return (
        <div style={styles}>
          <p>Copyrights (2017) <a href="https://www.linkedin.com/in/dvasylenko/" target='_blank'>Vasylenko D.A.</a></p>
        </div>
    );
  }
}