import React, { ReactNode } from "react";
import { Dim } from "../Dim";
import { Icon } from "../Icon";
import ListPerfectScrollbar from "./List.perfect.scroll";

export function renderLoadingContent({ marginTop }) {
  const style = {
    marginTop: `-${marginTop}px`,
  };

  return (
    <div className="virtal-list__container__loadingwrapper" style={style}>
      <Dim>
        <Icon id="circle-o-notch" spinning={true} />
        &nbsp; Loading items....
      </Dim>
    </div>
  );
}

export type ListProps = {
  data: any[];
  rowHeight: number;
  noRowsRenderer: () => JSX.Element;
  overscanRowCount: number;
  renderItem: (data: any, index: number) => ReactNode;
};
export function renderListContent(props: Partial<ListProps>) {
  return <ListPerfectScrollbar {...props} />;
}
