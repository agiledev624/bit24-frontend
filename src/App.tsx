import React from "react";
import "./App.scss";
import { renderRoutes } from "react-router-config";
import { Header } from "./components/header/Header";
import { ModalContainer } from "./ui-components";

function App({ route, match }) {
  return (
    <div>
      <Header />
      {renderRoutes(route.routes)}
      <ModalContainer />
    </div>
  );
}

export default App;
