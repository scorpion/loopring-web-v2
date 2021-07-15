import type { Column as RdgColumn } from 'react-data-grid';
import DataGrid, { SortColumn } from 'react-data-grid';
import styled from "@emotion/styled";
import { WithTranslation } from 'react-i18next';

import { WithT } from "i18next";
import React from "react";
import { Link } from '@material-ui/core';
import { Column, DataGridProps, TableProps, SortableHeaderCell, SortableHeaderCellProps } from './';
import { EmptyIcon } from 'static-resource'
import { EmptyDefault } from '../empty';

export const DataGridStyled = styled(DataGrid)`
  
  &.rdg {
    min-height: 350px;
    color: ${({theme}) => theme.colorBase.textPrimary};
    //color: inherit;
    box-sizing: border-box;
    border: rgba(0, 0, 0, 0) 0px solid;
    //background-color: inherit;

    .rdg-header-row {
      color: ${({theme}) => theme.colorBase.textSecondary};
      width: 100%;
      background-color: inherit;
    }
    &.scrollable .rdg-header-row {
      background-color: ${({theme}) => theme.colorBase.backgroundHeader};
    }

    .rdg-header-sort-name {
      flex-grow: initial;
    }

    .rdg-header-sort-cell {
      .rdg-header-sort-name + span {
        display: none;
      }

      .rdg-header-sort-name {
        .sort-icon svg {
          display: inline-block;
          transform-origin: center;
        }

        .DESC svg {
          transform: rotate(0deg) translateX(-3px) scale(1.2);
        }

        .ASC svg {
          transform: rotate(180deg) translateX(-3px) scale(1.2);
        }

        .NONE svg {
          transform: rotate(90deg) translateX(-3px) scale(1.2);
        }

      }
    }

    .rdg-cell-selected {
      box-shadow: inherit;
    }

    .rdg-row {
      box-sizing: border-box;
      background-color: inherit;
      width: 100%;

      &:hover {
        background: ${({theme}) => theme.colorBase.background().hover};

        .rdg-cell:first-of-type {
          border-left: ${({theme}) => theme.border.borderConfig({d_W: 2, c_key: 'selected'})}
        }
      }
    }

    .rdg-cell {
      color: inherit;
      border-left: rgba(0, 0, 0, 0) 2px solid;
      border-right: rgba(0, 0, 0, 0) 2px solid;
      border-bottom: rgba(0, 0, 0, 0) 2px solid;
      box-sizing: border-box;
      height: 100%;
    }
    .rdg-cell[aria-selected=true] {
      box-shadow: none;
    }

    .rdg-cell.success {
      color: ${({theme}) => theme.colorBase.success};
    }

    .rdg-cell.error {
      color: ${({theme}) => theme.colorBase.error};
    }
  }

` as typeof DataGrid;

// interface Action {
//     type: 'toggleSubRow' | 'deleteSubRow' | 'refresh' | 'sort';
//     id: string;
//     uniqueKey: string;
// }
// function reducer<R extends { children: R[], [ key: string ]: any }, SR>(rows: R[], {type, id, uniqueKey}: Action): R[] {
//     switch (type) {
//         case 'toggleSubRow':
//             return toggleSubRow(rows, id, uniqueKey);
//         case 'deleteSubRow':
//             return deleteSubRow(rows, id);
//         default:
//             return rows;
//     }
// }


export const generateColumns = <Row, SR>({
                                             columnsRaw,
                                             t
                                         }: { columnsRaw: readonly Column<Row, SR>[], [ key: string ]: any } & WithT): RdgColumn<Row, SR>[] => {
    const columns: Column<Row, SR>[] = columnsRaw.reduce((prev: RdgColumn<Row, SR>[], column: Column<Row, SR>) => {
        const {name, isHidden} = column;
        if (typeof name === 'string' && !isHidden) {
            column.name = t(name);
            prev.push(column);
        }
        return prev;
    }, [])
    return columns as Column<Row, SR>[];
}
export const generateRows = <Row, SR>(rawData: [][], rest: TableProps<Row, SR>): Row[] => {
    const {columnMode} = rest;
    return rawData.map(row => row.reduce((prev: { [ key: string ]: any }, cell, index) => {
        if (columnMode[ index ]) {
            prev[ columnMode[ index ].key ] = cell;
        }
        return prev;
    }, {_rawData: row}) as Row)
};

//TODO:
// {isLoading && <div className={loadMoreRowsClassname}>Loading more rows...</div>
export const Table = <R, SR>(props: DataGridProps<R, SR> & WithTranslation) => {
    const {
        EmptyRowsRenderer,
        generateRows,
        generateColumns,
        sortInitDirection,
        sortDefaultKey,
        sortMethod,
        rawData,
        style,
        frozeSort,
        rowRenderer,
        rowClassFn,
        rowKeyGetter,
        columnMode,
        onScroll,
        rowHeight, t, ...rest
    } = props;

    const columns = generateColumns({columnsRaw: columnMode, t});
    const [rows, setRows] = React.useState(generateRows(rawData, props));

    React.useEffect(()=>{
        setRows(generateRows(rawData, props));
    },[rawData])
    /*** sort handle start ***/
    const [sortColumns, setSortColumns] = React.useState<readonly Readonly<SortColumn>[]>([{
        columnKey: sortDefaultKey as any,
        direction: sortInitDirection ? sortInitDirection : undefined  as any
    }]);

    // const [[sortColumn, sortDirection], setSort] = React.useState<[string | undefined, SortDirection]>([sortDefaultKey, sortInitDirection ? sortInitDirection : undefined]);

    const sortedRows: readonly R[] = React.useMemo(() => {
        if (sortColumns.length === 0) return rows;
        const { columnKey, direction } = sortColumns[0];
        let sortedRows: R[] = [...rows];
        sortedRows = sortMethod ? sortMethod(sortedRows, columnKey, direction) : rows;
        return direction === 'DESC' ? sortedRows.reverse() : sortedRows;

    }, [rows, sortColumns, sortMethod]);
    // const [sortColumns, setSortColumns] = React.useState<readonly Readonly<SortColumn>[]>([]);
    const onSortColumnsChange = React.useCallback((sortColumns: SortColumn[]) => {
        setSortColumns(sortColumns.slice(-1));
    }, []);
    // const handleSort = React.useCallback((sortColumns: SortColumn[]) => {
    //     //console.log(direction);
    //     setSort([columnKey, direction]);
    // }, []);
    const loopringColumns = React.useMemo(() => {
        return columns.map(c => {
            if (c.headerRenderer) {
                return {...c} as Column<R, unknown>;
            } else {
                return {
                    ...c, headerRenderer: (props: SortableHeaderCellProps<R>) => <SortableHeaderCell {...props} />
                } as Column<R, unknown>;
            }
        }) as Column<R, unknown>[];
    }, [columns]);
    const RenderPic = styled.div`
      & svg {
        font-size: 110px;
        fill: #727FAA;
        fill-opacity: 0.3;
      }
    `
    const RenderEmptyMsg = styled.span`
      display: flex;

      .link {
        margin: 0 5px;
      }
    `

    /*** sort handle end ***/
    return <DataGridStyled
        {...rest}
        onScroll={onScroll}
        columns={loopringColumns as any}
        style={style}
        rows={(sortDefaultKey && sortedRows) ? sortedRows : rows}
        rowKeyGetter={rowKeyGetter}
        rowClass={row => rowClassFn ? rowClassFn(row, props) : ''}
        rowHeight={rowHeight ? rowHeight : 44}
        onRowsChange={setRows}
        onSortColumnsChange={onSortColumnsChange}
        // sortDirection={sortDirection}
        rowRenderer={rowRenderer as any}
        sortColumns={sortColumns}
        emptyRowsRenderer={() => EmptyRowsRenderer ? EmptyRowsRenderer :
            <EmptyDefault height={`calc(100% - var(--header-row-height))`} defaultPic={<RenderPic><EmptyIcon/></RenderPic>} message={() => {
                return <RenderEmptyMsg>Go to <Link className="link" onClick={() => console.log('EMPTY ON CLICK')}> link
                    or event</Link> at here</RenderEmptyMsg>
            }}/>}
    />;
    //  <EmptyDefault height={"calc(100% - 35px)"} url={'/path'} message={()=>{
    //  return <>Go to <Link to={'./path'}> link or event</Link> at here</>} } />   }
}