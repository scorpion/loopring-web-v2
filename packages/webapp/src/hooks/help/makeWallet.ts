import store from '../../stores';
import { WalletMap,WalletCoin,CoinKey } from '@loopring-web/component-lib/static-resource';
import * as fm from 'loopring-sdk';
import { fromWEI } from '../../utils/swap_calc_utils';
import { UserBalanceInfo } from 'loopring-sdk';
export type WalletMapExtend<C> =    {
    [K in CoinKey<C>]?: WalletCoin<C> & {
    detail:UserBalanceInfo
}
}


// export const makeWalletLayer1 = <C extends { [ key: string ]: any }>():{ walletMap: WalletMapExtend<C> | undefined } => {
//     const {walletLayer1} = store.getState().walletLayer1;
//     const {tokenMap} = store.getState().tokenMap;
//     let walletMap: WalletMapExtend<C> | undefined;
//     if (walletLayer1) {
//         walletMap = Reflect.ownKeys(walletLayer1).reduce((prev, item) => {
//             const {total, locked, pending: {withdraw}} = walletLayer1[ item as string ];
//             const countBig = fm.toBig(total).minus(fm.toBig(locked)).minus(fm.toBig(withdraw)).toString()
//             return {
//                 ...prev, [ item ]: {
//                     belong: item,
//                     count: fromWEI(tokenMap, item, countBig),
//                     detail: walletLayer1[ item as string ]
//                 }
//             }
//         }, {} as  WalletMapExtend<C> )
//     }
//
//     return {walletMap}
// }

export const makeWallet = <C extends { [ key: string ]: any }>():{ walletMap: WalletMapExtend<C> | undefined } => {
    const {walletLayer2} = store.getState().walletLayer2;
    const {tokenMap} = store.getState().tokenMap;
    let walletMap: WalletMapExtend<C> | undefined;
    if (walletLayer2) {
        walletMap = Reflect.ownKeys(walletLayer2).reduce((prev, item) => {
            const {total, locked, pending: {withdraw}} = walletLayer2[ item as string ];
            const countBig = fm.toBig(total).minus(fm.toBig(locked)).toString()
            return {
                ...prev, [ item ]: {
                    belong: item,
                    count: fromWEI(tokenMap, item, countBig),
                    detail: walletLayer2[ item as string ]
                }
            }
        }, {} as  WalletMapExtend<C> )
    }

    return {walletMap}
}