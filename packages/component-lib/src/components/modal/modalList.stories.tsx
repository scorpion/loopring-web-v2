import styled from '@emotion/styled'
import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'
import { withTranslation } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { Button, Grid } from '@material-ui/core'
import { AccountFull, AccountStatus, ConnectProviders, gatewayList } from '@loopring-web/common-resources'
import {
    MetaMaskProcess,
    ModalWalletConnect,
    ProviderMenu,
    SuccessConnect,
    WalletConnectProcess,
    WalletConnectQRCode,
    WalletConnectStep
} from './WalletConnect'
import { ModalQRCode, QRCodePanel } from './QRCode'
import { FailedConnect } from './WalletConnect/FailedConnect';
import {
    AccountBaseProps,
    AccountStep, ActiveAccountProcess,
    ApproveAccount, DepositApproveProcess,
    Depositing,
    FailedDeposit, FailedTokenAccess,
    FailedUnlock,
    HadAccount,
    ModalAccount,
    NoAccount,
    ProcessUnlock,
    SuccessUnlock, TokenAccessProcess,
} from './AccountInfo';
import { account, coinMap } from '../../static';
// import {  DepositProps, SwapTradeData, SwitchData, TradeBtnStatus } from '../panel';
import { WalletConnectBtn } from '../header';


const Style = styled.div`
  color: #fff;
  flex: 1;
  height: 100%;
  flex: 1;
`


// let tradeData: any = {};
// let depositProps: DepositProps<any, any> = {
//     tradeData,
//     coinMap,
//     walletMap,
//     depositBtnStatus: TradeBtnStatus.AVAILABLE,
//     onDepositClick: (tradeData: SwapTradeData<CoinType>) => {
//         console.log('Swap button click', tradeData);
//     },
//     handlePanelEvent: async (props: SwitchData<any>, switchType: 'Tomenu' | 'Tobutton') => {
//         return new Promise((res) => {
//             setTimeout(() => {
//                 console.log('wait 100, with props', props, switchType);
//                 res();
//             }, 500)
//         })
//     },
// }
const accountState: AccountFull = {
    account,
    status: 'DONE',
    resetAccount: () => undefined,
    updateAccount: () => undefined,
}
const ConnectButtonWrap = withTranslation('common')((_rest: any) => {
    return <>
        <Grid item xs={3}><WalletConnectBtn accountState={accountState}
                                            handleClick={() => undefined}></WalletConnectBtn></Grid>
        <Grid item xs={3}><WalletConnectBtn
            accountState={{...accountState, account: {...account, readyState: AccountStatus.NO_ACCOUNT}}}
            handleClick={() => undefined}></WalletConnectBtn></Grid>
        <Grid item xs={3}><WalletConnectBtn
            accountState={{...accountState, account: {...account, readyState: AccountStatus.DEPOSITING}}}
            handleClick={() => undefined}></WalletConnectBtn></Grid>
        <Grid item xs={3}><WalletConnectBtn
            accountState={{...accountState, account: {...account, readyState: AccountStatus.ACTIVATED}}}
            handleClick={() => undefined}></WalletConnectBtn></Grid>
        <Grid item xs={3}><WalletConnectBtn
            accountState={{...accountState, account: {...account, readyState: AccountStatus.ERROR_NETWORK}}}
            handleClick={() => undefined}></WalletConnectBtn></Grid>
        <Grid item xs={3}><WalletConnectBtn
            accountState={{...accountState, account: {...account, readyState: AccountStatus.LOCKED}}}
            handleClick={() => undefined}></WalletConnectBtn></Grid>
        <Grid item xs={3}><WalletConnectBtn
            accountState={{...accountState, account: {...account, readyState: AccountStatus.LOCKED, _chainId: 5}}}
            handleClick={() => undefined}></WalletConnectBtn></Grid>
    </>
})

const coinInfo = coinMap[ 'USDC' ]
const Template: Story<any> = withTranslation()(({...rest}: any) => {
    const [openAccount, setOpenAccount] = React.useState(false)
    const [openWallet, setOpenWallet] = React.useState(false)
    const [openQRCode, setOpenQRCode] = React.useState(false)
    gatewayList[ 0 ] = {
        ...gatewayList[ 0 ],
        handleSelect: () => console.log('metaMask 11'),
    };
    const url: string = 'xxxxxx'
    const walletList = React.useMemo(() => {
        return Object.values({
            [ WalletConnectStep.Provider ]: <ProviderMenu
                gatewayList={gatewayList} {...{providerName: ConnectProviders.MetaMask, ...rest}}/>,
            [ WalletConnectStep.MetaMaskProcessing ]: <MetaMaskProcess {...rest}/>,
            [ WalletConnectStep.WalletConnectProcessing ]: <WalletConnectProcess {...rest}/>,
            [ WalletConnectStep.WalletConnectQRCode ]: <WalletConnectQRCode  {...rest} url={url}/>,
            [ WalletConnectStep.SuccessConnect ]: <SuccessConnect {...{...rest, providerName: 'MetaMask'}}/>,
            [ WalletConnectStep.FailedConnect ]: <FailedConnect {...rest} onRetry={() => {
            }}/>,
        })

    }, [url])
    const mainBtn = React.useMemo(() => {
        return <Button variant={'contained'} fullWidth size={'medium'} onClick={() => {
        }}>{'unlock'} </Button>
    }, []);
    const accountInfoProps: AccountBaseProps = {
        ...account,
        level: 'VIP 1',
        etherscanUrl: 'https://material-ui.com/components/material-icons/'
    }

    const accountList = React.useMemo(() => {
        return Object.values({
            [ AccountStep.NoAccount ]: <NoAccount {...{
                ...accountInfoProps, goDeposit: () => {
                }
            }}/>,
            // [ AccountStep.Deposit ]: <DepositPanel  _height={480} _width={400}  {...{...rest, ...depositProps}} />,
            [ AccountStep.Depositing ]: <Depositing {...{
                providerName: ConnectProviders.MetaMask,
                etherscanLink: accountInfoProps.etherscanUrl, ...rest
            }}/>,
            [ AccountStep.FailedDeposit ]: <FailedDeposit {...rest} label={'depositTitleAndActive'}
                                                          onRetry={() => undefined}
                                                          etherscanLink={accountInfoProps.etherscanUrl}/>,
            [ AccountStep.SignAccount ]: <ApproveAccount  {...{...accountInfoProps, ...rest}}
                                                          goActiveAccount={() => undefined}/>,
            [ AccountStep.ProcessUnlock ]: <ProcessUnlock {...{providerName: ConnectProviders.MetaMask, ...rest}}/>,
            [ AccountStep.SuccessUnlock ]: <SuccessUnlock {...rest}/>,
            [ AccountStep.FailedUnlock ]: <FailedUnlock {...rest} onRetry={() => undefined}/>,
            [ AccountStep.HadAccount ]: <HadAccount mainBtn={mainBtn} {...accountInfoProps}/>,
            [ AccountStep.TokenAccessProcess ]: <TokenAccessProcess {...{
                ...rest,
                coinInfo,
                providerName: ConnectProviders.MetaMask
            }}/>,
            [ AccountStep.DepositApproveProcess ]: <DepositApproveProcess {...{
                ...rest,
                providerName: ConnectProviders.MetaMask
            }}/>,
            [ AccountStep.ActiveAccountProcess ]: <ActiveAccountProcess {...{
                ...rest,
                providerName: ConnectProviders.MetaMask
            }}/>,
            [ AccountStep.FailedTokenAccess ]: <FailedTokenAccess {...{...rest, coinInfo}}/>,
        })

    }, [])

    return (
        <>
            <Style>
                <MemoryRouter initialEntries={['/']}>
                    <h4>Connect Button status</h4>
                    <Grid container spacing={2} alignContent={'center'} justifyContent={'space-around'}
                          marginBottom={2}>
                        <ConnectButtonWrap/>
                    </Grid>
                    <Grid container spacing={2}>
                        {walletList.map((panel, index) => {
                            return <Grid item key={index} width={400} padding={2}>
                                {panel}
                            </Grid>
                        })}
                    </Grid>
                    <Button variant={'outlined'} size={'small'} color={'primary'} style={{marginRight: 8}}
                            onClick={() => setOpenWallet(true)}>Connect wallet</Button>
                    <ModalWalletConnect open={openWallet} onClose={() => setOpenWallet(false)} onBack={() => {
                        setOpenWallet(false)
                    }}
                                        panelList={walletList} step={WalletConnectStep.WalletConnectQRCode}/>
                    <Grid container spacing={2}>

                        {accountList.map((panel, index) => {
                            return <Grid item key={index} width={400} padding={2}>
                                {panel}
                            </Grid>
                        })}
                    </Grid>
                    <Button variant={'outlined'} size={'small'} color={'primary'} style={{marginRight: 8}}
                            onClick={() => setOpenAccount(true)}>Connect wallet</Button>
                    <ModalAccount open={openAccount} onClose={() => setOpenAccount(false)}
                                  panelList={accountList} step={AccountStep.Deposit}/>


                    <Button variant={'outlined'} size={'medium'} color={'primary'} onClick={() => setOpenQRCode(true)}>QR
                        Code</Button>
                    <ModalQRCode open={openQRCode} onClose={() => setOpenQRCode(false)} title={'title'}
                                 description={'my description'} url="http://www.163.com"/>
                    <QRCodePanel {...{...rest}} description="Ox123213123123" url="http://www.163.com"
                                 handleClick={() => {
                                     console.log('click')
                                 }}/>
                    {/*<WrapTransferPanel/>*/}
                    {/*<WrapDepositPanel/>*/}
                    {/*<WrapWithdrawPanel />*/}
                </MemoryRouter>
            </Style>
        </>
    )
}) as Story<any>

export const ModalListStory = Template.bind({})

export default {
    title: 'components/ModalList',
    component: ModalWalletConnect,
    argTypes: {},
} as Meta
