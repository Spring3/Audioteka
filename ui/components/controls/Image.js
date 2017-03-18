import React from 'react';

export default class Image extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const imageStyles = {
      background: `url('${this.props.src}') no-repeat center`,
      margin: '0 auto',
      height: `${this.props.height}px`,
      width: `${this.props.width}px`,
      border: 'solid 4px white',
      WebkitBoxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
      boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)'
    };
    return (
      <div className={this.props.cols} style={this.props.styles}>
        <div className="rounded-circle" style={imageStyles}/>
        {this.props.children}
      </div>
    );
  };
}
