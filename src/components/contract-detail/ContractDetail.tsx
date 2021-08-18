import { Collapsible } from "@/ui-components";
import React from "react";

const ContractRow = ({ title, data }) => (
  <div className="d-flex d-align-items-center d-justify-content-space-between">
    <span className="show-soft">{title}</span>
    <span>{data}</span>
  </div>
);

class ContractDetail extends React.Component {
  render() {
    return (
      <Collapsible title="Contract Detail">
        <div className="contract-detail__wrapper">
          <ContractRow
            title="Instrument"
            data={<span className="text--blue">BTC/USD</span>}
          />
          <ContractRow title="Pricing Source" data="bit24" />
          <ContractRow title="Time to expiry" data="Perpetual" />
          <ContractRow title="Max Leverage" data="150x" />
          <ContractRow title="Contract Value" data="1 USD" />
          <ContractRow title="Tick Size" data="0.5 USD" />
        </div>
      </Collapsible>
    );
  }
}

export default ContractDetail;
