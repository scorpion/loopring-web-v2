import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'

// import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import store, { persistor } from 'stores'
// import { getLibrary } from 'utils/web3_tools'
import { getTheme, i18n, provider, ProviderComposer } from "@loopring-web/common-resources"
import { ThemeProvider as MuThemeProvider, } from '@mui/material'
import { LocalizationProvider } from '@mui/lab'
import MomentUtils from '@mui/lab/AdapterMoment'

import { ThemeProvider } from "@emotion/react"

import { I18nextProvider } from "react-i18next"
import { PersistGate } from 'redux-persist/integration/react'
import { useSettings } from '@loopring-web/component-lib';
import React, { Provider as TProvider } from 'react';
import { TimeoutCheckProvider } from 'TimeoutCheckProvider'

if (process.env.REACT_APP_VER) {
    console.log('VER:', process.env.REACT_APP_VER)
}

const ProviderApp = React.memo(({children}: { children: JSX.Element }) => {
    const providers: Array<[TProvider<any>, any]> = [
        provider(Provider as any, {store}),
        provider(LocalizationProvider as any, {dateAdapter: MomentUtils}),
        provider(I18nextProvider as any, {i18n: i18n}),
    ] as any
    return <ProviderComposer providers={providers}>{children}</ProviderComposer>
})
const ProviderThen = React.memo(({children}: { children: JSX.Element }) => {
    const {themeMode} = useSettings();
    const providers: Array<[TProvider<any>, any]> = [
        provider(MuThemeProvider as any, {theme: getTheme(themeMode)}),
        provider(ThemeProvider as any, {theme: getTheme(themeMode)}),
        provider(PersistGate as any, {persistor, loading: null}),
        provider(TimeoutCheckProvider as any),
    ] as any
    return <ProviderComposer providers={providers}>{children}</ProviderComposer>
})

ReactDOM.render(
    <ProviderApp>
        <ProviderThen>
            <App/>
        </ProviderThen>
    </ProviderApp>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

if (process.env.NODE_ENV !== 'production') {
    reportWebVitals(console.log)
}
