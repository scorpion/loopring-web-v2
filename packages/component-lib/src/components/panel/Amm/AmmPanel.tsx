import { PanelContent, WrapStyled, } from '../../basic-lib';
import { AmmChgData, AmmWithdrawWrap, IconButtonStyled } from '../components';
import { Grid, Tab, Tabs, Toolbar } from '@material-ui/core';
import { AmmData, AmmInData, IBData, RefreshIcon } from 'static-resource';
import { AmmDepositWrap } from '../components/panel/AmmWrap/AmmDeposit';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AmmProps, AmmPanelType } from './Interface';
import React from 'react';
import { useDeepCompareEffect } from 'react-use';
import { Box } from '@material-ui/core/';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@emotion/react';

enum AmmPanelTypeMap {
    Deposit = 0,
    WithDraw = 1
}

const TabPanelBtn = ({t, value, handleChange}: WithTranslation & any) => {
    return <Tabs
        value={value}
        onChange={handleChange}
        aria-label="disabled tabs example"
    >
        <Tab label={t('labelLiquidityDeposit')} value={0}/>
        <Tab label={t('labelLiquidityWithdraw')} value={1}/>
    </Tabs>
}
export const AmmPanel = withTranslation('common', {withRef: true})(<T extends AmmData<C extends IBData<I> ? C : IBData<I>>, I,
    ACD extends AmmInData<I>,
    C = IBData<I>>(
    {
        t,
        tabSelected = AmmPanelType.Deposit,
        ammDepositData,
        ammWithdrawData,
        disableDeposit,
        disableWithdraw,
        handleAmmAddChangeEvent,
        handleAmmRemoveChangeEvent,
        ammCalcData,
        tokenDepositAProps,
        tokenDepositBProps,
        tokenWithDrawAProps,
        tokenWithDrawBProps,
        ammDepositBtnStatus,
        ammWithdrawBtnStatus,
        ammDepositBtnI18nKey,
        ammWithdrawBtnI18nKey,
        onAmmAddClick,
        onAmmRemoveClick,
        onChangeEvent,
        handleError,
        height,
        width,
        anchors,
        ...rest
    }: AmmProps<T, I, ACD, C> & WithTranslation) => {
    const [index, setIndex] = React.useState(AmmPanelTypeMap[ tabSelected ]);
    const [ammChgDepositData, setAmmChgDepositData] = React.useState<AmmChgData<T>>({tradeData: ammDepositData,type:'coinA'});
    const [ammChgWithdrawData, setAmmChgWithdrawData] = React.useState<Pick<AmmChgData<T>, 'tradeData'> & { type?: 'coinA' | 'coinB' | 'percentage'}>({tradeData: ammWithdrawData});

    //
    useDeepCompareEffect(() => {
        if (ammDepositData !== ammChgDepositData.tradeData) {
            setAmmChgDepositData({...ammChgDepositData, tradeData: ammDepositData});
        }
        if (ammWithdrawData !== ammChgWithdrawData.tradeData && ammChgWithdrawData.type !== 'percentage' ) {
            setAmmChgWithdrawData({...ammChgWithdrawData, tradeData: ammWithdrawData});
        }
    }, [ammDepositData,ammWithdrawData]);

    const _onChangeAddEvent = React.useCallback(async ({tradeData, type}: AmmChgData<T>) => {
        await handleAmmAddChangeEvent(tradeData, type)
        if (typeof onChangeEvent == 'function') {
            setAmmChgDepositData(onChangeEvent({tradeData, type} as AmmChgData<T>));
        }else {
            setAmmChgDepositData({tradeData, type})
        }
    }, [handleAmmAddChangeEvent, onChangeEvent])
    const _onChangeRemoveEvent = React.useCallback(async ({
                                                                tradeData,
                                                                type,
                                                                percentage
                                                            }: Pick<AmmChgData<T>, 'tradeData'> & { type: 'coinA' | 'coinB' | 'percentage', percentage?: number }) => {

        await handleAmmRemoveChangeEvent(tradeData, type === 'percentage' ? 'coinA' : type)
        if (typeof onChangeEvent == 'function') {
            setAmmChgWithdrawData(onChangeEvent({tradeData, type} as AmmChgData<T>));
        } else {
            if(percentage){
                console.log('from percentage')
            }
            setAmmChgWithdrawData({tradeData, type});

            // if (type !== 'percentage') {
            //     console.log('from Input',tradeData);
            // } else {
            //     console.log('from percentage',tradeData)
            //     setAmmChgWithdrawData({tradeData,type});
            // }
        }

    }, [handleAmmRemoveChangeEvent, onChangeEvent]);
    // const [tab, setTab] = React.useState(0);
    const handleTabChange = React.useCallback((_event: any, newValue: any) => {
        if (index !== newValue) {
            setIndex(newValue);
        }

    }, [index]);
    const panelList: Pick<PanelContent<"ammDeposit" | "ammWithdraw">, 'key' | 'element'>[] = [
        {
            key: "ammDeposit",
            element: () => <AmmDepositWrap<T, I, ACD, C> key={"ammDeposit"} {...{
                t,
                ...rest,
                disableDeposit,
                ammDepositBtnStatus,
                ammDepositBtnI18nKey,
                ammCalcData,
                onChangeEvent: _onChangeAddEvent,
                onAmmAddClick,
                handleError,
                ammData:ammChgDepositData.tradeData,
                tokenAProps: {...tokenDepositAProps},
                tokenBProps: {...tokenDepositBProps},
            }}/>,
        },
        {
            key: "ammWithdraw",
            element: () => <AmmWithdrawWrap<T, I, ACD, C> key={"ammWithdraw"} {...{
                t,
                ...rest,
                anchors,
                selectedPercentage:-1,
                disableDeposit,
                ammWithdrawBtnStatus,
                ammWithdrawBtnI18nKey,
                ammCalcData,
                onChangeEvent: _onChangeRemoveEvent,
                onAmmRemoveClick,
                handleError,
                ammData: ammChgWithdrawData.tradeData,
                tokenAProps: {...tokenWithDrawAProps},
                tokenBProps: {...tokenWithDrawBProps},
            }}/>,
        },
    ];
    const theme = useTheme();
    return <WrapStyled height={height} width={width}>
        <Grid container className={'container'} direction={'column'}
              justifyContent={"start"} flexWrap={'nowrap'}>
            <Toolbar variant={'dense'}  >
                <Box alignSelf={'center'}>
                    <TabPanelBtn {...{t, value: index, handleChange: handleTabChange, ...rest}} />
                </Box>
                <Box alignSelf={'center'}>
                    <IconButtonStyled edge="end"
                                      className={'switch outline'}
                                      color="inherit"
                                      aria-label="to Professional">
                        <RefreshIcon/>
                    </IconButtonStyled>
                </Box>

            </Toolbar>
            {/*<Grid item flex={1} justifyContent={'stretch'} alignItems={'stretch'} height={'100%'}>*/}
            <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={index}>
                {panelList.map((panel) => {
                    return <Grid item justifyContent={'space-evenly'} alignItems={'stretch'} height={'100%'}
                                 key={panel.key}>{panel.element()}</Grid>
                })}
            </SwipeableViews>
            {/*</Grid>*/}
        </Grid>
    </WrapStyled>
})  as <T extends AmmData<C extends IBData<I> ? C : IBData<I>>, I,
    ACD extends AmmInData<I>,
    C = IBData<I>>(props: AmmProps<T, I, ACD, C> & React.RefAttributes<any>) => JSX.Element;

