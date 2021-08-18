import { GUEST_USER } from "@/reducers/auth.reducer";
import { createSelector } from "reselect";

const getUserReducer = (state) => state.user;

export const getUserEmail = createSelector(getUserReducer, (user) =>
  user.email === GUEST_USER ? "" : user.email
);
export const isUserLoggedIn = createSelector(
  getUserReducer,
  (user) => user.loggedIn || false
);

export const getAccessToken = createSelector(
  getUserReducer,
  (user) => user.token || null
);
