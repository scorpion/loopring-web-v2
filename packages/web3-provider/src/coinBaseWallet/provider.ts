import Web3 from 'web3';
import { walletServices } from '../walletServices';
import { ErrorType } from '../command';
import { ConnectProviders, ThemeType } from '@loopring-web/common-resources';
import { WalletLink, WalletLinkProvider } from 'walletlink';

const APP_NAME = 'Loopring layer2'
const APP_LOGO_URL = 'http://static.loopring.io/assets/'+'svg/logo.svg'


const RPC_URLS: { [ chainId: number ]: string } = {
    1: process.env.REACT_APP_RPC_URL_1 as string,
    5: process.env.REACT_APP_RPC_URL_5 as string
}
export const WalletLinkProvide = async (theme?:any): Promise<{ provider?:  WalletLinkProvider, web3?: Web3, } | undefined> => {
    try {
        // const BRIDGE_URL = await (fetch('https://wcbridge.loopring.network/hello').then(({status})=>{
        //     return status === 200? process.env.REACT_APP_WALLET_CONNECT_BRIDGE:'https://bridge.WalletLink.org'
        // }).catch(()=>{
        //     return  'https://bridge.WalletLink.org';
        // }))
        // var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        // const theme = useTheme()

        const walletLink: WalletLink =   new WalletLink({
            appName: APP_NAME,
            appLogoUrl: APP_LOGO_URL,
            darkMode: theme && theme?.mode  === ThemeType.dark
        });

        const provider = walletLink.makeWeb3Provider(RPC_URLS[5], 5);
        if(provider.isWalletLink){
            await provider.enable();
            const web3 = new Web3(provider as any);
            provider.request({method: 'eth_requestAccounts'});
            walletServices.sendConnect(web3, provider);

            return {provider, web3}
        }else {
            return undefined
        }

        // new WalletLinkProvider({
        //     rpc: RPC_URLS,
        //     bridge: BRIDGE_URL,
        //     pollingInterval: POLLING_INTERVAL,
        //     qrcode: false,
        // });
        // const {connector} = provider;
        // let web3: Web3|undefined
        // if (!connector.connected && account === undefined) {
        //     await connector.createSession();
        //     const uri = connector.uri;
        //     walletServices.sendProcess('nextStep', {qrCodeUrl: uri});
        //     await provider.enable();
        //     web3 = new Web3(provider as any);
        //     walletServices.sendConnect(web3, provider);
        //
        // } else if (!connector.connected && account !== undefined) {
        //     console.log('WalletLink reconnect connected is failed',account,provider)
        //     // WalletLinkUnsubscribe(provider);
        //     // walletServices.sendDisconnect('', 'WalletLink not connect');
        //     web3=undefined
        //     throw new Error('WalletLink not connect');
        // } else if (account && provider.isWalletLink) {
        //     console.log('WalletLink reconnect connected is true',account, provider, connector.session)
        //     await provider.enable();
        //     web3 = new Web3(provider as any);
        //     walletServices.sendConnect(web3, provider)
        // }

    } catch (error) {
        console.log('error happen at connect wallet with WalletLink:', error)
        walletServices.sendError(ErrorType.FailedConnect, {connectName: ConnectProviders.WalletLink, error})
    }
}

export const WalletLinkSubscribe = (provider: any, web3: Web3) => {
    if (provider) {
        provider.on("accountsChanged", (accounts: Array<string>) => {
            // const _accounts = await web3.eth.getAccounts();
            // console.log('accounts:', accounts)
            if (accounts.length) {
                walletServices.sendConnect(web3, provider)
            } else {
                walletServices.sendDisconnect(-1, 'disconnect for no account');
            }

        });
        provider.on("chainChanged", (chainId: number) => {
            walletServices.sendConnect(web3, provider);
        });
        provider.on("disconnect", (code: number, reason: string) => {

            walletServices.sendDisconnect(code, reason);

        });
        provider.on("message", (payload:any) => {
            if (payload && payload.type === 'eth_subscription' && payload.data) {
                const data = payload.data;
                console.log('message','xxxxxxxxxxxx')
                // if (data.subscription && _this.subscriptions.has(data.subscription)) {
                //     _this.subscriptions.get(data.subscription).callback(null, data.result);
                // }
            }

        });
    }
}

export const WalletLinkUnsubscribe = async (provider: any) => {
    if (provider && typeof provider.removeAllListeners === 'function') {
        // provider.removeAllListeners('accountsChanged');
        // provider.removeAllListeners('chainChanged');
        // provider.removeAllListeners('disconnect');
        await provider.removeAllListeners();
    }
}