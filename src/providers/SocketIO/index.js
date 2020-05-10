import React from "react";
import { SocketProvider } from "socket.io-react";
import io from "socket.io-client";
import {connect} from 'react-redux';
import { compose } from "recompose";
import { set_socket } from "../../redux/socket";

class SocketIO extends React.Component {
  componentDidMount() {
    const uri = window.location.hostname + ":4001";
    const socket = io.connect(uri);
    if (this.props.useRedux) {
      this.props.setSocket(socket);
    }
  }

  render() {
    return <SocketProvider>{this.props.children}</SocketProvider>;
  }
}

export default compose(
  connect(null, (dispatch, props) => {
    return {
      setSocket: (payload) => {
        dispatch(set_socket(payload));
      },
    };
  })
)(SocketIO);
