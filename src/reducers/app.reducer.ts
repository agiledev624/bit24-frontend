import {
  CLOSE_ALL_MODALS,
  CLOSE_MODAL,
  OPEN_MODAL,
  UPDATE_WS_ENTRY,
} from "@/actions/app.actions";
import { USER_LOGOUT_SUCCESS } from "@/actions/auth.actions";
import { TICKER_INITIALIZED } from "@/actions/ticker.actions";
import { riskWsUrl, testurl1 } from "@/config/config";
import { EMPTY_ARRAY, shallowCompareObjects } from "@/exports";

const initialState = {
  modals: EMPTY_ARRAY,
  toasts: EMPTY_ARRAY,
  socketAddresses: [testurl1],
  adminRiskUrl: riskWsUrl,
  isReady: false,
  //... profile or sth
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_WS_ENTRY: {
      const entries = action.payload;

      return {
        ...state,
        socketAddresses: [...state.socketAddresses, ...entries],
      };
    }
    case TICKER_INITIALIZED: {
      return {
        ...state,
        isReady: true,
      };
    }
    case OPEN_MODAL: {
      const { component, id, props } = action.payload;

      const modal = {
        id,
        component,
        modalProps: props,
      };

      let modals = [...state.modals];

      const index = modals.findIndex((m) => m.id === modal.id);
      if (!~index) {
        modals = [...modals, modal];
        return {
          ...state,
          modals,
        };
      } else {
        if (
          component !== modals[index].component ||
          !shallowCompareObjects(props, modals[index].modalProps)
        ) {
          modals[index] = modal;
          return {
            ...state,
            modals,
          };
        }
      }

      return {
        ...state,
      };
    }
    case CLOSE_MODAL: {
      const id = action.payload;
      const remainModals = state.modals.filter((modal) => modal.id !== id);
      const isEmpty = remainModals.length === 0;

      return {
        ...state,
        modals: isEmpty ? EMPTY_ARRAY : remainModals,
      };
    }
    case CLOSE_ALL_MODALS:
    case USER_LOGOUT_SUCCESS: {
      return {
        ...state,
        modals: EMPTY_ARRAY,
      };
    }
    default:
      return state;
  }
};
