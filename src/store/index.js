import { createStore } from "vuex";
import action from "./services/action";

const store = createStore({
  modules: {
    action,
  },
  state: {
    STATUS_CODE: {
      ERROR_SERVER: 999,
      CONTENT_TYPE_NULL: 998,
      CONTENT_TYPE_WRONG: 997,
      METHOD_REQUIRED_POST: 990,
      FUNCTION_NOT_FOUND: 989,
      WARNING_PROCESS: 919,
      INVALID_BODY: 897,
      UNAUTHORIZATION: 880,
      DATA_NULL: 200,
      DATA_OK: "000",
    },
    CATEGORY_TYPE: {
      DEFAULT: 1,
      MENU: 2,
      BANNER: 3,
    },
    user: null,
  },
});

export default store;
