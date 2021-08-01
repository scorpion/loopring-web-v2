import { ConnectProviders } from './connect';
import { StateBase } from './sagaStatus';

export type ErrorObject = {
    from?: string,
    timestamp?: number,
    messageKey: string
    [ key: string ]: any,
}


export enum AccountStatus {
    UN_CONNECT = 'UN_CONNECT',
    CONNECT = 'CONNECT',
    NO_ACCOUNT = 'NO_ACCOUNT',
    LOCKED = 'LOCKED',
    ACTIVATED = 'ACTIVATED',
    DEPOSITING = 'DEPOSITING'
}

export enum fnType {
    UN_CONNECT = 'UN_CONNECT',
    CONNECT = 'CONNECT',
    NO_ACCOUNT = 'NO_ACCOUNT',
    LOCKED = 'LOCKED',
    ACTIVATED = 'ACTIVATED',
    DEPOSITING = 'DEPOSITING',
    DEFAULT = 'DEFAULT',
}

export type Account = {
    accAddress: string,
    readyState: keyof typeof AccountStatus | 'Unknown',
    accountId: number | -1,
    level: string,
    apiKey: string,
    eddsaKey: any,
    publicKey: any,
    connectName: keyof typeof ConnectProviders,
    chainId: 1 | 5,
}
export type AccountState = Account & StateBase;

// export  enum StorageCommands {
//     CLEAN= 'CLEAN',
//     UPDATE='UPDATE'
// }
