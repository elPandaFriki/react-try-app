import { defineMessages } from "react-intl";
import _ from "lodash";
import en from "./en";
import es from "./es";
import zh from "./zh";
import ENUMS from "../constants/enums";

const messages = defineMessages({
  [ENUMS.LanguagePb.ENGLISH]: en,
  [ENUMS.LanguagePb.SPANISH]: es,
  [ENUMS.LanguagePb.CHINESE]: zh,
});

const translate = (intl, payload) => {
  const id = _.get(payload, "id");
  const language = _.get(payload, "language");
  const type = _.get(payload, "type");
  const value = _.get(payload, "value");
  let translation = _.get(payload, "id", "Uknown translation");
  let use_default = false;
  try {
    if (intl != null) {
      if (messages[language]) {
        switch (type) {
          case ENUMS.TranslationPb.TIME:
            if (value) {
              translation = intl.formatTime(value);
            }
            break;
          case ENUMS.TranslationPb.DATE:
            if (value) {
              translation = intl.formatDate(
                value,
                _.get(payload, "options", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })
              );
            }
            break;
          case ENUMS.TranslationPb.NUMBER:
            if (value) {
              translation = intl.formatNumber(
                value,
                _.get(payload, "options", {
                  style: "currency",
                  currency: "USD",
                })
              );
            }
            break;
          case ENUMS.TranslationPb.PLURAL:
            if (value) {
              translation = intl.formatPlural(
                value,
                _.get(payload, "options", {
                  tyle: "ordinal",
                })
              );
            }
            break;
          case ENUMS.TranslationPb.LIST:
            if (language && id) {
              translation = intl.formatList(
                ["Me", "myself", "I"],
                _.get(payload, "options", {
                  type: "conjunction",
                })
              );
            }
            break;
          case ENUMS.TranslationPb.MESSAGE:
            if (language && id) {
              const message = _.get(messages[language], id.split('.'))
              translation = intl.formatMessage(message);
            }
            break;
          case ENUMS.TranslationPb.CUSTOM_MESSAGE:
            if (language && id) {
              translation = intl.formatMessage(
                messages[language][id],
                _.get(payload, "options", {
                  name: "David",
                })
              );
            }
            break;
          default:
            break;
        }
      }
    }
  } catch (e) {
    use_default = true;
  }
  if (use_default) {
    translation = _.get(payload, "id", "Uknown translation");
  }
  return translation;
};

export default translate;
