import React from 'react';
import _get from 'lodash/get';
import _isUndefined from 'lodash/isUndefined';
import _isFunction from 'lodash/isFunction';
import _last from 'lodash/last';

import {SortDirection, Column} from 'react-virtualized';
import classNames from 'classnames';
import Title from './Table.title';
import { Dim } from '../Dim';
import { Icon } from '../Icon';

/**
 * Returns a sorted copy of the provided dataset; values are cast to strings
 * before comparison via localeCompare(). The transformers map is optional,
 * and can be used to process field values before casting/comparison.
 *
 * @param {Object} params
 * @param {string} params.sortBy - used as key into transformers map
 * @param {string} params.sortDirection
 * @param {Array} params.data
 * @param {Object} params.transfomers - data transform functions, key'ed by col
 * @param {Object} params.undefinedOrderSortingFunction - undefinedOrderSortingFunction functions
 * @return {Array} sortedData
 */
export function getSortedData(args) {
    let {data, sortBy, sortDirection, columns, undefinedOrderSortingFunction} = args;
    
    var transformers = getTransformers(columns);
    var sortKeys = getSortKeys(columns);
    var sortFunctions = getSortFunctions(columns);
  
    var transform = transformers[sortBy] || function (v) {
        return v;
    };
  
    var sortedData = [...data];
    var asc = sortDirection === 'ASC';
    var key = sortKeys[sortBy] || sortBy;
    sortedData.sort(function (aRow, bRow) {
        var a = transform(aRow[key], aRow);
        var b = transform(bRow[key], bRow);
    
        if (_isFunction(undefinedOrderSortingFunction) && sortDirection === null) {
            return undefinedOrderSortingFunction(aRow, bRow);
        }
    
        if (_isFunction(sortFunctions[key])) {
            var result = sortFunctions[key](a, b);
            return asc ? result : -result;
        }
    
        if (!Number.isNaN(+a) && !Number.isNaN(+b)) {
            return asc ? +a - +b : +b - +a;
        }
        
        return asc ? "".concat(a).localeCompare(b) : "".concat(b).localeCompare(a);
    });

    return sortedData;
};
  
export function getSortKeys(columns) {
    var sortKeys = {};
    columns.forEach(function (col) {
        if (col.sortKey) {
            sortKeys[col.dataKey] = col.sortKey;
        }
    });
    return sortKeys;
};
  
  
export function getSortFunctions(columns) {
    var sortFunctions = {};
    columns.forEach(function (col) {
        var key = col.sortKey || col.dataKey;
  
        if (col.sortFunction) {
            sortFunctions[key] = col.sortFunction;
        }
    });

    return sortFunctions;
};


export function sortData(args, props: any = {}) {
    const {getSortedData, sortedDataPostProcessor} = props;
    var sortedData = getSortedData(args);

    sortedDataPostProcessor(sortedData);
    
    return sortedData;
}

function getTransformers(columns) {
    var transformers = {};

    columns.forEach(col => {
        if(col.dataKey && col.transformData) {
            transformers[col.dataKey] = col.transformData;
        }
    });

    return transformers;
}


export function rowNeedsWrap({rowData, columns, tableWidth}) {
    var transformers = getTransformers(columns);
    
    for(let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const {dataKey} = col;

        const opts = {
            rowData,
            dataKey,
            col,
            tableWidth,
            transformer: transformers[dataKey]
        };

        if(colNeedsWrap(opts)) {
            return true;
        }
    }

    return false;
}

export function colNeedsWrap({rowData, dataKey, col, tableWidth, transformer = (v, k) => v}) {
    const {wrapLengthLimit, wrapAtWidth} = col;

    let field = `${transformer(rowData[dataKey], rowData)}`;

    if(col.wrapFunc) {
        return col.wrapFunc({
            rowData,
            tableWidth
        }) ? 1 : 0;
    }

    if(!wrapAtWidth) 
        return 0;

    if(tableWidth <= wrapAtWidth && (!wrapLengthLimit || field.length >= wrapLengthLimit)) {
        return 1;
    }

    return 0;
}

const nextSortOrderTristate = {
    [SortDirection.DESC]: SortDirection.ASC,
    [SortDirection.ASC]: null,
    "null": SortDirection.DESC
};

const nextSortOrder = {
    [SortDirection.DESC]: SortDirection.ASC,
    [SortDirection.ASC]: SortDirection.DESC
};

export function getNextSort({
    prevSortDirection, 
    prevSortBy,
    sortBy,
    defaultSortDirection,
    supportsCustomSort
}) {
    if(prevSortBy !== sortBy) {
        return SortDirection.DESC;
    }

    const next = supportsCustomSort ? nextSortOrderTristate[prevSortDirection] : nextSortOrder[prevSortDirection];

    return _isUndefined(next) ? defaultSortDirection : next;
}

export function getHeaderRowRenderer(height, message, headerClasses) {
    const innerStyle = {
        lineHeight: `${message ? height / 2 : height}px`
    };

    return function({className, style, columns}) {
        const styleObj = {
            ...style,
            position: 'absolute',
            zIndex: 1,
            top: 0,
            // top: `-${height}px`,
            height: `${height}px`
        };

        const styleMessage = {
            ...innerStyle,
            paddingLeft: 10
        };

        return (
            <div 
                role="row"
                className={classNames("themed-border cpn-virtualized-table__headerrow", className, headerClasses)}
                style={styleObj}
            >
                <span style={innerStyle}>{columns}</span>
                {message && <span style={styleMessage}>{message}</span>}
            </div>
        );
    }
}


/**
 * Returns the render height for the specified row, taking wrap conditions into
 * account. Rows are doubled in height if wrapped.
 *
 * TODO: Support arbitrary height scaling (needs content length estimation)
 *
 * @param {Object} args - see getRowHeightFunc()
 * @param {number} index - item index in dataset
 * @return {number} height - in pixels
 */
export function getHeightForRow({data, cols, rowHeight, width}, index) {
    const wrapCols = getWrappedColumns(cols);
    const item = data[index];

    if(!item) {
        return 0;
    }

    let fieldData;

    for(let i = 0; i < wrapCols.length; i++) {
        const wrapCol = wrapCols[i];
        const {dataKey, wrapLengthLimit, wrapAtWidth, wrapFunc} = wrapCol;

        fieldData = _get(item, dataKey);

        if(wrapFunc && wrapFunc({rowData: item, tableWidth: width})) {
            return rowHeight * 2;
        }
        
        // Double height if text wrapping is required by the cell
        if(width <= wrapAtWidth && (!wrapLengthLimit || fieldData.length >= wrapLengthLimit)) {
            return rowHeight * 2;
        }
    }

    return rowHeight;
}

export function getWrappedColumns(cols) {
    return cols.filter(col => {
        return (col.wrapFunc || col.dataKey) && (col.wrapLengthLimit || col.wrapAtWidth);
    })
}

//args {data, cols, rowHeight, width}
export function getRowHeightFunc(args) {
    return function({index}) {
        return getHeightForRow(args, index);
    }
}

export function getTableWidthFunc(originalWidth, enabledHorizontalScroll, columns) {
    if(!enabledHorizontalScroll)
        return originalWidth;

    const fixedWidth = columns.reduce((a, {width}) => a + width, 0);

    // return 115% fixedWidth so that content fits nicely
    return fixedWidth > originalWidth ? fixedWidth*1.15: originalWidth;
}

export function renderColumns({
    columns,
    width,
    rowHeight,
    name,
    toggleRowSelection,
    isRowSelected,
    selectAllRows,
    selectNoRows,
    multiSelectActive,
    multiSelectStart,
    toggleMultiSelect,
    colPadding,
    columnWidths
}) {
    const filteredColumns = columns.filter(col => !col.minWidthForRender || !width || width >= col.minWidthForRender);
    const transformers = getTransformers(filteredColumns);

    return filteredColumns.map(function(col, i) {
        let colPaddingRight = colPadding;

        const style = {
            ...(col.style || {}),
            marginLeft: i === 0 ? `${colPadding}px` : 'unset',
            marginRight: `${colPaddingRight}px`
        };

        const headerStyle = {
            ...(col.headerStyle || {}),
            marginLeft: i === 0 ? `${colPadding}px` : 'unset',
            marginRight: `${colPaddingRight}px`
        };

        return (
            <Column
                className={col.className}
                headerClassName={col.headerClassName}
                key={i}
                flexGrow={col.flexGrow || 0}
                flexShrink={col.flexShrink || 1}
                width={columnWidths ? columnWidths[i] : col.width}
                minWidth={col.minWidth}
                maxWidth={col.maxWidth}
                headerStyle={headerStyle}
                style={style}
                label={!_isFunction(col.title) ? col.title || '' : col.title({
                    tableWidth: width,
                    selectAllRows,
                    selectNoRows
                })}
                dataKey={col.dataKey || ''}
                headerRenderer={col.renderHeader || function(args) {
                    //@ts-ignore
                    return renderHeaderCell(args, col);
                }}
                disableSort={!!col.disableSort}
                cellRenderer={function(args) {
                    return col.renderCell({
                        ...args,
                        rowHeight,
                        tableWidth: width,
                        tableName: name,
                        toggleRowSelection,
                        multiSelectActive,
                        multiSelectStart,
                        toggleMultiSelect,
                        isRowSelected: isRowSelected(args.rowData, args.rowIndex),
                        wrap: colNeedsWrap({
                            ...args, 
                            col,
                            tableWidth: width,
                            transformer: transformers[col.dataKey] || ((v) => v)
                        })
                    });
                }}
            />
        );
    })
}

export function renderHeaderCell({dataKey, label, sortBy, sortDirection}, col) {
    return <Title
        orderBy={sortBy}
        sortOrder={(sortDirection || '').toLocaleLowerCase()}
        format={{
            alt: col.alt,
            altUnderline: col.altUnderline,
            altCursorPointer: col.altCursorPointer,
            title: label,
            sortingEnabled: !col.disableSort,
            id: dataKey
        }}
    />;
}

export function renderLoadingContent({headerHeight}) {
    const style = {
        // marginTop: `${headerHeight}px`
    };

    return(
        <div className="cpn-virtualized-table__loadingwrapper" style={style}>
            <Dim>
                <Icon id="circle-o-notch" spinning={true}/>
                &nbsp; Loading items....
            </Dim>
        </div>
    );
};


export function mergeColWidths(columns, startIndex, count) {
    const TABLE_MARGIN = 5;

    const size = count ? count + startIndex : columns.length - startIndex;
    let width = startIndex === 0 ? TABLE_MARGIN * (size + 1) : 0;
    for (var i = 0; i < size; i += 1) {
        width += getColWidth(columns, startIndex + i);
    }

    return width;
}

export function getColWidth(columns, index) {
    var flex = _get(columns, [index, 'props', 'style', 'flex'], '');
    const vals = flex.split(' ');
    const size = _last(vals);

    const sizeN = Number.isNaN(+size) ? // px suffix
        //@ts-ignore
        +size.substring(0, size.length - 2) : +size;

    return !Number.isNaN(sizeN) ? sizeN : 0;
}