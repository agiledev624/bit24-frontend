import React, { useEffect, useState } from "react";
import { AutoSizer, Column, InfiniteLoader } from "react-virtualized";
import { Table } from "./Table.virtualized";

// type TableInfiniteProps = {} & VirtualizedTableProps;

// export const TableInfiniteLoader = (props: TableInfiniteProps) => {
//   const [items, saveItems] = useState(props.data || [])
//   let promiseResolve;
//   function loadMore({startIndex, stopIndex}) {
//     console.log('startIndex, stopIndex', startIndex, stopIndex);
//     setTimeout(() => {
//       saveItems([items, ...items]);
//       promiseResolve()
//      }, 1500)
//     return new Promise(resolve => {
//       promiseResolve = resolve;
//     });
//   }

//   useEffect(() => {
//     loadMore({startIndex: 0, stopIndex: 10});
//   }, [])

//   return (
//     <InfiniteLoader
//       isRowLoaded={({ index }) => !!items[index]}
//       loadMoreRows={loadMore}
//       rowCount={1000}
//     >
//       {({ onRowsRendered, registerChild }) => (
//         <Table
//           ref={registerChild}
//           data={items}
//           onRowsRendered={onRowsRendered}
//           {...props}
//         />
//       )}
//     </InfiniteLoader>
//   );
// }

export class TableInfiniteLoader extends React.Component<any, any> {
  promiseResolve;

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      items: props.data,
    };
  }

  loadMore({ startIndex, stopIndex }) {
    console.log("startIndex, stopIndex", startIndex, stopIndex);
    // simulate a request
    setTimeout(() => {
      this.actuallyLoadMore();
    }, 500);
    // we need to return a promise
    return new Promise((resolve, reject) => {
      this.promiseResolve = resolve;
    });
  }

  actuallyLoadMore() {
    // fake new data
    //@ts-ignore
    this.setState({ items: this.state.items.concat(this.state.items) }, () => {
      console.log("length", this.state.items.length);
    });
    // resolve the promise after data where fetched
    this.promiseResolve();
  }

  render() {
    return (
      <div className="container">
        <h1>Infinite scrolling autosize table example </h1>
        <InfiniteLoader
          //@ts-ignore
          isRowLoaded={({ index }) => !!this.state.items[index]}
          loadMoreRows={this.loadMore}
          rowCount={100}
        >
          {({ onRowsRendered, registerChild }) => (
            <Table
              ref={registerChild}
              //@ts-ignore
              data={this.state.items}
              onRowsRendered={onRowsRendered}
              {...this.props}
            />
            // <AutoSizer>
            //   {({ width }) => (
            //     <Table
            //       ref={registerChild}
            //       onRowsRendered={onRowsRendered}
            //       rowClassName='table-row'
            //       headerHeight={40}
            //       width={width}
            //       height={300}
            //       rowHeight={40}
            //       rowCount={this.state.items.length}
            //       rowGetter={({ index }) => this.state.items[index]}
            //     >
            //       <Column
            //         label='Id'
            //         dataKey='id'
            //         width={width * 0.2}
            //       />
            //       <Column
            //         label='Name'
            //         dataKey='name'
            //         width={width * 0.4}
            //       />
            //       <Column
            //         label='E.mail'
            //         dataKey='email'
            //         width={width * 0.4}
            //       />
            //     </Table>
            //   )}
            // </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    );
  }
}
