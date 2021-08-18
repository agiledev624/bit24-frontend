import React, { useEffect } from "react";
import { renderRoutes } from "react-router-config";
import { SocketProvider } from "@/components/SocketProvider";
import { useDispatch } from "react-redux";
import { updateUISetting } from "@/actions/ui-setting.actions";

export const SocketWrapper = ({ route, match }) => {
  const dispatch = useDispatch();
  const symbol = match.params.symbol;

  useEffect(() => {
    if (!symbol) return;

    dispatch(updateUISetting({ key: "last_symbol", value: symbol }));
  }, [dispatch, symbol]);

  return (
    <div>
      {renderRoutes(route.routes)}
      <SocketProvider />
    </div>
  );
};
