import React, { useEffect } from 'react'
import { TradeTable, TradeFilterTable, RawDataTradeItem } from '@loopring-web/component-lib'
import { WithTranslation, withTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { Box, Paper } from '@material-ui/core'
import store from 'stores'
import { LoopringAPI } from 'stores/apis/api'
import { volumeToCount } from 'hooks/help'
import { StylePaper } from '../../styled'
import { toBig } from 'loopring-sdk'
import { StringToNumberWithPrecision, VolToNumberWithPrecision, } from 'utils/formatter_tool'

// const StylePaper = styled(Box)`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
//   height: 100%;
//   flex: 1;
//   background-color: ${({ theme }) => theme.colorBase.background().default};
//   border-radius: ${({ theme }) => theme.unit}px;
//   padding: 20px;
//   margin-bottom: ${({ theme }) => 2* theme.unit}px;
//   .title {
//     font-family: Gilroy-Medium;
//     font-size: ${({ theme }) => theme.unit * 3}px;
//     line-height: 19px;
//   }
//
//   .tableWrapper {
//     display: flex;
//     flex: 1;
//     margin-top: 20px;
//     border: 1px solid ${({ theme }) => theme.colorBase.borderColor};
//     border-radius: ${({ theme }) => theme.unit}px;
//     padding: 26px 0;
//
//     .rdg {
//       flex: 1;
//     }
//   }
// ` as typeof Paper;
//
// // side: keyof typeof TradeTypes;
// //     amount: {
// //         from: {
// //             key: string;
// //             value: number|undefined;
// //         },
// //         to: {
// //             key: string;
// //             value: number|undefined;
// //         }
// //     };
// //     price:{
// //         key:string
// //         value:number|undefined,
// //     }
// //     // priceDollar: number;
// //     // priceYuan: number;
// //     fee: {
// //         key: string;
// //         value: number|undefined;
// //     };
// //     time: number;

const TradePanel = withTranslation('common')((rest:WithTranslation<'common'>) => {
    const container = React.useRef(null);
    const [pageSize, setPageSize] = React.useState(10);
    const [originalData, setOriginalData] = React.useState<RawDataTradeItem[]>([])

    const { accountId, apiKey } = store.getState().account;
    const tokenMap = store.getState().tokenMap.tokenMap

    useEffect(() => {
        (async function getUserApi () {
            if (LoopringAPI && LoopringAPI.userAPI && accountId && apiKey && tokenMap) {
                const userTrades = await LoopringAPI.userAPI.getUserTrades({
                    accountId,
                }, apiKey)

                if (userTrades && userTrades.userTrades) {
                  setOriginalData(userTrades.userTrades.map(o => {
                    const marketList = o.market.split('-')
                    // due to AMM case, we cannot use first index
                    const baseToken = marketList[marketList.length - 2]
                    const quoteToken = marketList[marketList.length - 1]

                    const amt = toBig(o.volume).times(o.price).toString()

                    return ({
                      side: o.side,
                      price: {
                        key: baseToken,
                        value: StringToNumberWithPrecision(o.price, baseToken)
                      },
                      fee: {
                        key: quoteToken,
                        value: VolToNumberWithPrecision(o.fee, quoteToken)
                      },
                      time: Number(o.tradeTime),
                      amount: {
                        from: {
                          key: baseToken,
                          value: VolToNumberWithPrecision(o.volume, baseToken)
                        },
                        to: {
                          key: quoteToken,
                          value: VolToNumberWithPrecision(amt, quoteToken)
                        }
                      }
                    })
                  }))
                }
            }
        })()
    }, [accountId, apiKey])

    React.useEffect(() => {
        // @ts-ignore
        let height = container?.current?.offsetHeight;
        if (height) {
            setPageSize(Math.floor((height - 120) / 44) - 2);
        }
    }, [container, pageSize]);

    // const txList: any[] = []

    return (
        <>
            <StylePaper ref={container}>
                <div className="title">Trades</div>
                <div className="tableWrapper">
                    <TradeTable {...{
                      rawData: originalData,
                      pagination: {
                        pageSize: pageSize
                      },
                      showFilter: true,
                      ...rest}}/>
                </div>
            </StylePaper>
        </>
    )
})

export default TradePanel