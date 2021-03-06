import { Box, Grid, } from '@mui/material'
import { WithTranslation, withTranslation } from 'react-i18next'
import BasicInfoPanel from './panel/BasicInfoPanel'
import TradePanel from './panel/TradePanel'
import { AlertImpact, ConfirmImpact, SwapPanel, Toast } from '@loopring-web/component-lib'

import { TOAST_TIME } from 'defs/common_defs'
import { FixedStyle } from 'pages/styled'
import { useSwap } from './hookSwap';
import { getValuePrecisionThousand } from '@loopring-web/common-resources';

export const SwapPage = withTranslation('common')(({...rest}: WithTranslation) => {

    const {
        tradeCalcData,
        tradeData,
        tradeFloat,
        tradeArray,
        myTradeArray,
        marketArray,
        handleSwapPanelEvent,
        onSwapClick,
        pair,
        swapBtnI18nKey,
        swapBtnStatus,
        toastOpen,
        closeToast,
        should15sRefresh,
        // debugInfo,
        alertOpen,
        confirmOpen,
        refreshRef,
        swapFunc,
        isSwapLoading,
        pageTradeLite,
        toPro
    } = useSwap({path: '/trade/lite'});

    return <>

        <Toast alertText={toastOpen?.content ?? ''} severity={toastOpen?.type ?? 'success'}
               open={toastOpen?.open ?? false}
               autoHideDuration={TOAST_TIME} onClose={closeToast}/>

        <Box flex={1} marginRight={3} alignContent={'stretch'} flexDirection={'column'} flexWrap={'nowrap'}>
            <BasicInfoPanel {...{
                ...rest,
                ...pair, marketArray,
                tradeFloat, tradeArray
            }} />
            <TradePanel tradeArray={tradeArray} myTradeArray={myTradeArray}/>
        </Box>

        <Box display={'flex'} style={{minWidth: 'var(--swap-box-width)'}}>
            <FixedStyle>
                <SwapPanel
                    //disabled={isSwapLoading}
                    toPro={toPro}
                    tokenBuyProps={{disabled: isSwapLoading, decimalsLimit: tradeCalcData.buyPrecision}}
                    tokenSellProps={{disabled: isSwapLoading, decimalsLimit: tradeCalcData.sellPrecision}}
                    onRefreshData={should15sRefresh}
                    refreshRef={refreshRef}
                    tradeData={tradeData as any}
                    tradeCalcData={tradeCalcData as any}
                    onSwapClick={onSwapClick}
                    swapBtnI18nKey={swapBtnI18nKey}
                    swapBtnStatus={swapBtnStatus}
                    {...{handleSwapPanelEvent, ...rest}}
                />

            </FixedStyle>
        </Box>
        <AlertImpact handleClose={swapFunc} open={alertOpen}
                     value={getValuePrecisionThousand(pageTradeLite?.priceImpactObj?.value,2) + '%' as any}/>
        <ConfirmImpact handleClose={swapFunc} open={confirmOpen}
                       value={getValuePrecisionThousand(pageTradeLite?.priceImpactObj?.value,2) + '%' as any}/>
    </>
});


// SwapPage
