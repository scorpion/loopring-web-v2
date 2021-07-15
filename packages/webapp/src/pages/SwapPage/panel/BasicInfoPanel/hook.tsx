import { useCallback, useState } from 'react'

import { useExchangeAPI } from 'hooks/exchange/useApi'
import { useCustomDCEffect } from 'hooks/common/useCustomDCEffect'

import { TradingInterval, Candlestick, GetCandlestickRequest, GetDepthRequest, GetTickerRequest, dumpError400, getExistedMarket } from 'loopring-sdk'
import { fromWEI } from 'utils/swap_calc_utils'

import { ChartUnit, CoinInfo } from '@loopring-web/component-lib/static-resource'

import { ChartType } from '@loopring-web/component-lib'

import { TGItemData, TGItemJSXInterface, } from '@loopring-web/component-lib'

import { IGetDepthDataParams } from '@loopring-web/component-lib/components/charts/scaleAreaChart/data'

const toggleData: TGItemData[] = [
  {
    value: ChartType.Trend,
    key: ChartType.Trend,
    label: 'label' + ChartType.Trend
  },
  {
    value: ChartType.Depth,
    key: ChartType.Depth,
    label: 'label' + ChartType.Depth
  },
]

export function useBasicInfo(props: any, coinAInfo: any, coinBInfo: any, marketArray: any[], t: any) {
  const tgItemJSXs: TGItemJSXInterface[] = toggleData.map(({ value, label, key }) => {
    return { value, tlabel: t(label), key, JSX: <>{t(label)}</> }
  })

  // const { base, quote, market, tokens } = props

  const { market, amm } = getExistedMarket(marketArray, coinAInfo?.name, coinBInfo?.name)

  const [chartType, setChartType] = useState<ChartType>(ChartType.Trend)

  // console.log('---useBasicInfo market:', market, ' amm:', amm, ' chartType:', chartType)
  //
  // const [change, setChange] = useState(0)
  //
  // const [volume, setVolume] = useState('')

  const [chartUnit, setChartUnit] = useState(ChartUnit.D1)

  const [originData, setOriginData] = useState<any>(undefined)

  const handleChange = useCallback((_e: React.MouseEvent, value: any) => {
    // Settings.setChartType(value)
    // console.log('useBasicInfo handleChange:', value)
    setOriginData(undefined)
    setChartType(value)
  }, [setOriginData, setChartType])

  const handleChartUnitChange = (event: React.MouseEvent<HTMLElement, MouseEvent>, newValue: string) => {
      const mappedValue = newValue === '1H' ? ChartUnit.H1 : newValue === '1W' ? ChartUnit.W1 : ChartUnit.D1
      setChartUnit(mappedValue)
  }

  const exchangeApi = useExchangeAPI()

  // useCustomDCEffect(async () => {
  //
  //   if (!exchangeApi || !market || !tokens || !quote) {
  //     return
  //   }
  //
  //   let mounted = true
  //
  //   try {
  //
  //     const request: GetTickerRequest = {
  //       market: market.market,
  //     }
  //
  //     const ticker = await exchangeApi.getTicker(request)
  //     if (mounted) {
  //
  //       if (ticker.tickList[0].change) {
  //         setChange(ticker.tickList[0].change)
  //       }
  //
  //       if (ticker.tickList[0].base_token_volume) {
  //         const baseVol = fromWEI(tokens.tokenSymbolMap, base, ticker.tickList[0].base_token_volume) as string
  //         setVolume(baseVol)
  //       }
  //     }
  //   }
  //   catch (reason) {
  //     dumpError400(reason, 'ChartPanel getCandlestick')
  //   }
  //
  //   return () => {
  //     mounted = false
  //   }
  //
  // }, [exchangeApi, market, tokens, base,])

  const tgItemJSXsPriceChart: TGItemJSXInterface[] = Object.keys(ChartUnit).reduce((pre, item) => {
    // @ts-ignore
    const tGItemData: TGItemData = { value: ChartUnit[item], key: ChartUnit[item], label: 'label' + ChartUnit[item] };
    pre.push({ value: tGItemData.value, tlabel: t(tGItemData.label ? tGItemData.label : tGItemData.key), key: tGItemData.key, JSX: <>{t(tGItemData.label ? tGItemData.label : tGItemData.key)}</> })
    return pre
  }, [] as TGItemJSXInterface[])

  useCustomDCEffect(async () => {
  
    let mounted = true
  
    if (!exchangeApi || !market || !amm) {
      return
    }
  
    if (chartType === ChartType.Trend) {
      const request: GetCandlestickRequest = {
        market: amm as string,
        interval: TradingInterval.min15,
        limit: 96
      }
  
      try {
        const candlesticks = await exchangeApi.getCandlestick(request)
  
        if (mounted) {
          const originData = candlesticks.candlesticks.map((item: Candlestick) => {
            return {
              timeStamp: item.timestamp,
              low: item.low,
              high: item.high,
              open: item.open,
              close: item.close,
              volume: item.quoteVol,
            }
          })
          setOriginData(originData)
        }
      }
      catch (reason) {
        dumpError400(reason, 'ChartPanel getCandlestick')
      }
  
    } else {
      const request: GetDepthRequest = {
        market,
      }
  
      try {
  
        const { depth } = await exchangeApi.getMixDepth(request)
        console.log('useBasicInfo depth:', depth)
        if (mounted) {
          const originData: IGetDepthDataParams = {
            bidsPrices: depth.bids_prices,
            bidsAmtTotals: depth.bids_amtTotals as any,
            asksPrices: depth.asks_prices,
            asksAmtTotals: depth.asks_amtTotals as any,
          }
          setOriginData(originData)
        }
  
      } catch (reason) {
        dumpError400(reason)
      }
  
    }
  
    return () => {
      mounted = false
    }
  
  }, [exchangeApi, amm, market, chartType])

  return {
    // change,
    // volume,
    chartUnit,
    chartType,
    tgItemJSXs,
    tgItemJSXsPriceChart,
    handleChange,
    originData,
    handleChartUnitChange,
  }
}