import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { IntlProvider } from "react-intl";
import translations from "../../locale";
import { injectIntl } from "react-intl";
import { set_intl } from "../../redux/intl";
import _ from 'lodash';

const ReduxConnector = compose(
  connect(null, (dispatch, props) => {
    return {
      setIntl: (payload) => {
        dispatch(set_intl(payload));
      },
    };
  }),
  injectIntl,
  lifecycle({
    componentDidMount() {
      this.props.setIntl(this.props.intl);
    },
  })
)((props) => {
  return <React.Fragment>{props.children}</React.Fragment>;
});

class Intl extends React.Component {
  render() {
    let inner = <React.Fragment>{this.props.children}</React.Fragment>;
    if (this.props.useRedux) {
      inner = <ReduxConnector>{this.props.children}</ReduxConnector>;
    }
    return (
      <IntlProvider locale={this.props.language} messages={translations}>
        {inner}
      </IntlProvider>
    );
  }
}

export default compose(
  connect((state, props) => {
    return {
      language: _.get(state, "client.language"),
    };
  }, null)
)(Intl);
