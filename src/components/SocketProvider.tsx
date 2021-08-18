import { closeWs, establishWsConn } from "@/actions/ws.actions";
import { usePrevious } from "@/hooks";
import { SingletonWSManager } from "@/internals";
import { getWsUrlAddresses } from "@/selectors/app.selectors";
import { isUserLoggedIn } from "@/selectors/auth.selectors";
import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import _isString from "lodash/isString";

interface Props {
  symbol: string;
  adminRiskUrl: string;
  isLoggedIn: boolean;
  openWsConnection: (urls: string[] | string) => void;
  closeWs: (urls: string[] | string) => void;
  socketAddresses: string[];
}

const SocketProviderMemo = ({
  openWsConnection,
  closeWs,
  isLoggedIn,
  socketAddresses,
  adminRiskUrl,
}: Partial<Props>) => {
  const lastValue = usePrevious(isLoggedIn);
  const marketUrls = useMemo(
    () =>
      socketAddresses.filter((url) => SingletonWSManager.isMarketWsByUrl(url)),
    [socketAddresses]
  );
  const orderUrls = useMemo(
    () =>
      socketAddresses.filter((url) => SingletonWSManager.isOrderWsByUrl(url)),
    [socketAddresses]
  );

  useEffect(() => {
    openWsConnection(marketUrls);

    return () => {
      closeWs(marketUrls);
    };
  }, [openWsConnection, closeWs, marketUrls]);

  useEffect(() => {
    console.log("[wsProvider] establish admin risk >>>>> ");
    openWsConnection(adminRiskUrl);

    return () => {
      console.log("[wsProvider] closing admin risk >>>>> ");
      closeWs(adminRiskUrl);
    };
  }, [openWsConnection, closeWs, adminRiskUrl]);

  useEffect(() => {
    console.log(
      "[wsProvider] state updated isLogged",
      isLoggedIn,
      "last logged in",
      lastValue
    );

    if ((isLoggedIn && !lastValue) || orderUrls) {
      openWsConnection(orderUrls);
    } else if (!isLoggedIn && lastValue) {
      closeWs(orderUrls);
    }

    return () => {
      if (!isLoggedIn && lastValue) {
        closeWs(orderUrls);
      }
    };
  }, [isLoggedIn, lastValue, openWsConnection, closeWs, orderUrls]);

  return null;
};

const mapStateToProps = (state) => ({
  isLoggedIn: isUserLoggedIn(state),
  socketAddresses: getWsUrlAddresses(state),
  adminRiskUrl: state.app.adminRiskUrl,
});

const mapDispatchToProps = (dispatch) => ({
  openWsConnection(urls: string[] | string) {
    if (_isString(urls)) urls = [urls];

    if (!urls.length) return;

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const id = SingletonWSManager.getIdFromUrl(url);

      if (url && id) {
        console.log(">>>>[wsProvider] open socket", id, "url", url);
        dispatch(establishWsConn({ reconn: false, id, url }));
      }
    }
  },
  closeWs(urls: string[] | string) {
    if (_isString(urls)) urls = [urls];

    if (!urls.length) return;

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const id = SingletonWSManager.getIdFromUrl(url);
      console.log("[wsProvider] >>>>>>>> close socket", id, "url", url);
      if (id) {
        dispatch(closeWs({ id, reconn: false }));
      }
    }
  },
});
export const SocketProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(SocketProviderMemo);
