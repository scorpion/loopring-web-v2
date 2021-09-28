import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { getSocketStatus, sendSocketTopic, socketEnd } from './reducer'
import store from '../index';
import { myLog } from '@loopring-web/common-resources';

const getEndSocket = async () =>{
    await  window.loopringSocket.socketClose();
    myLog('socket end')
    return
}
export function* closeSocket() {
    try {

        if (window.loopringSocket) {
            yield call(getEndSocket);
            yield put(getSocketStatus(undefined));
        }else{
            yield put(getSocketStatus(undefined));
        }
    } catch (err) {
        yield put(getSocketStatus(err));
    }
}

const getSocket = async ({socket, apiKey}:{socket:any,apiKey:string}) =>{
    await  window.loopringSocket.socketSendMessage({socket, apiKey})
    myLog('socket send')
    return
}
export function* sendMessage({payload}: any) {
    try {
        const {apiKey} = store.getState().account;
        const {socket} = payload;
        if (window.loopringSocket) {
            // yield call(window.loopringSocket.socketSendMessage, {socket, apiKey})
            yield call(getSocket, {socket, apiKey})
            yield put(getSocketStatus(undefined));
        }else {
            yield put(getSocketStatus(undefined));
        }
    } catch (err) {
        yield put(getSocketStatus(err));
    }
}

function* socketEndSaga() {
    yield all([takeLatest(socketEnd, closeSocket)]);
}

function* socketSendMessageSaga() {
    yield all([takeLatest(sendSocketTopic, sendMessage)]);
}


export const socketForks = [
    // fork(socketSaga),
    fork(socketEndSaga),
    fork(socketSendMessageSaga),
    //   fork(initConfig),
]



