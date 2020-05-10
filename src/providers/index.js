import Redux from "./Redux";
import SocketIO from "./SocketIO";
import Intl from "./Intl";
import Theme from "./Theme";

const Providers = {
  Redux,
  SocketIO,
  Intl,
  Theme,
};

export default Providers;
export const serialized = Providers;
