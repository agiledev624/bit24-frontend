import { initTickers } from "@/actions/ticker.actions";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export const Init = React.memo(() => {
  const dispatch = useDispatch();

  useEffect(() => {
    // did mount
    // request market data
    dispatch(initTickers());
  }, [dispatch]);

  return null;
});
