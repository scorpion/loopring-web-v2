import { Avatar, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core/';
import { WithTranslation } from "react-i18next";
import React from "react";
import styled from "@emotion/styled";
import { CoinItemProps, CoinMenuProps } from "./Interface";
import { CoinInfo, CoinKey, WalletCoin } from 'static-resource';
import { useImage } from '../resource';
import { Virtuoso } from 'react-virtuoso';


function _CoinMenu<C, I extends CoinInfo<C>>({
                                                 coinMap = {}, walletMap = {}, filterBy = (ele, filterString) => {
        return filterString && filterString.length ? RegExp(filterString).test(ele.simpleName) : true
    }, filterString, handleSelect, allowScroll = true, selected = null,
                                                 listProps = {},
                                                 height = '100px',
                                                 ...rest
                                             }: CoinMenuProps<C, I> & WithTranslation, _ref: React.Ref<HTMLUListElement>) {
    const [select, setSelect] = React.useState<CoinKey<C> | null>(selected as CoinKey<C>);
    const virtuoso = React.useRef(null);
    let rowIndex = 0;
    React.useEffect(() => {
        if (select !== selected) {
            setSelect(selected);
        }
    }, [select, selected])
    //const list = React.useMemo(() =>
    const list = Object.keys(coinMap).reduce((list: Array<{ walletCoin: WalletCoin<C>, key: string }>, key) => {
        if (filterBy(coinMap[ key ], filterString)) {
            const walletCoin: WalletCoin<C> = walletMap[ key ] ? walletMap[ key ] : {belong: key, count: 0}
            list.push({walletCoin, key: key});
            if (select === key) {
                rowIndex = list.length - 1;
            }
        }
        return list;
    }, [])
    const handleListItemClick = React.useCallback((_event: React.MouseEvent, select: CoinKey<C>) => {
        setSelect(select);
        handleSelect && handleSelect(_event, select);
    }, [handleSelect])
    return <Virtuoso<{ walletCoin: WalletCoin<C>, key: string }> data={list}
                                                                 style={{minHeight: height, height: height}}
                                                                 ref={virtuoso}
                                                                 initialTopMostItemIndex={rowIndex}
                                                                 itemContent={(index, item) => {
                                                                     let {walletCoin, key} = item;//list[ index ];
                                                                     return <CoinItem<C> key={index} {...{
                                                                         coinInfo: coinMap[ key ] as CoinInfo<C>,
                                                                         walletCoin,
                                                                         select: select,
                                                                         handleListItemClick,
                                                                         itemKey: key as CoinKey<C>, ...rest
                                                                     }} ></CoinItem>

                                                                 }}
    />

}

export const CoinMenu = React.memo(React.forwardRef(_CoinMenu)) as <C, I = CoinInfo<C>>(props: CoinMenuProps<C, I> & WithTranslation & React.RefAttributes<HTMLDivElement>) => JSX.Element;

const StyledCoinItem = styled(ListItem)`
  && {
    width: 100%;
    display: flex;
    justify-content: stretch;
    justify-items: center;
    height: var(--list-coin-item);
    box-sizing: border-box;
    padding-left: ${({theme}) => theme.unit / 2 * 5}px;
    padding-right: ${({theme}) => theme.unit / 2 * 5}px;
  }

  .MuiListItemIcon-root {
    height: var(--btn-icon-size);
    width: var(--btn-icon-size);
    min-width: var(--btn-icon-size);
    margin-right: ${({theme}) => theme.unit}px;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center
  }

  .MuiListItemText-multiline {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .MuiAvatar-root{
      width: var(--list-menu-coin-size);
      height: var(--list-menu-coin-size);
  }

`

export const CoinItem = React.memo(React.forwardRef(<C extends any>({
                                                                        t,
                                                                        coinInfo,
                                                                        walletCoin,
                                                                        select,
                                                                        itemKey,
                                                                        handleListItemClick
                                                                    }: CoinItemProps<C> & WithTranslation, ref: React.ForwardedRef<any>) => {
    const {simpleName} = coinInfo;
    const hasLoaded = useImage(coinInfo.icon ? coinInfo.icon : '').hasLoaded;

    return <StyledCoinItem
        button
        ref={ref}
        key={itemKey}
        selected={select === simpleName}
        onClick={(event: React.MouseEvent) => handleListItemClick(event, itemKey)}
    >
        <ListItemIcon>
            {/*<img src={coinInfo.icon} alt={t(simpleName)}/>*/}
            {/*<Avatar alt={simpleName}*/}
            {/*        src={coinInfo.icon}*/}
            {/*        srcSet={`${coinInfo.icon},./images/icon-default.png`}/>*/}
            <Avatar variant="square" alt={coinInfo?.simpleName}
                // src={sellData?.icon}
                    src={hasLoaded ? coinInfo.icon : 'static/images/icon-default.png'}/>
        </ListItemIcon>
        <ListItemText primary={t(simpleName)} secondary={
            <>
                <Typography sx={{display: 'block'}} component="span" color="textSecondary" variant="body1">
                    {walletCoin.count}
                </Typography>
            </>
        }/>
    </StyledCoinItem>
})) as unknown as <C>(props: CoinItemProps<C> & WithTranslation & React.RefAttributes<any>) => JSX.Element;

//  <C>(props: CoinItemProps<C> & RefAttributes<HTMLElement>) => JSX.Element;
//as React.ComponentType<InputButtonProps<coinType,CoinInfo> & RefAttributes<HTMLDivElement>>;


