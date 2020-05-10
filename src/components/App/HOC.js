import _ from "lodash";
import { compose, withHandlers } from "recompose";
import { set_language, toggle_color_mode } from "../../redux/client";
import { fullConnect } from "../../high_order_components";
import Pure from "./Pure";
import translate from "../../locale";
import ENUMS from "../../constants/enums";
import { withStyles } from "@material-ui/styles";
import styles from "./styles.css.js";

const AppHOC = compose(
  fullConnect(
    (state, props) => {
      return {
        socket: _.get(state, "socket"),
        intl: _.get(state, "intl"),
        language: _.get(state, "client.language"),
      };
    },
    (dispatch, props) => {
      return {
        setLanguage: (payload) => {
          dispatch(set_language(payload));
        },
        setTheme: () => {
          dispatch(toggle_color_mode());
        }
      };
    }
  ),
  withHandlers({
    intlCallback: (props) => (id) => {
      return translate(props.intl, {
        id,
        language: props.language,
        type: ENUMS.TranslationPb.MESSAGE,
      });
    },
  }),
  withStyles(styles, {
    withTheme: true,
  })
)(Pure);

export default AppHOC;
