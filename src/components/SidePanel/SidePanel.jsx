import React, { Component } from 'react'
import Groups from './Groups';
import UserPanel from './UserPanel'


export default class SidePanel extends Component {


  render() {
    // console.log(this.props.userName);
    return (
      <>
        <UserPanel 
          userName={this.props.userName} 
          user={this.props.user}
        />
        <Groups 
          userName={this.props.userName} 
          user={this.props.user}
        />
      </>
    )
  }
}
