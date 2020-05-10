import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

const fullConnect = (mapper, dispatcher) => {
  return (BaseComponent) => {
    return compose(
      connect(mapper),
      connect(null, dispatcher)
    )(
      class extends React.Component {
        render() {
          return <BaseComponent {...this.props} />;
        }
      }
    );
  };
};

export default fullConnect;
