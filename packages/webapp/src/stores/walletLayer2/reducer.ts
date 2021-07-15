import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit'
import { WalletLayer2Map, WalletLayer2States } from './interface';
import { STATUS } from '../constant';


const initialState:WalletLayer2States  = {
    walletLayer2:undefined,
    status:'UNSET',
    errorMessage:null,
}
const walletLayer2Slice:Slice = createSlice({
    name: 'walletLayer2',
    initialState,
    reducers: {
        updateWalletLayer2(state, action:PayloadAction<string | undefined>) {
            state.status = STATUS.PENDING
        },
        reset(state, action:PayloadAction<string | undefined>) {
            state.walletLayer2 = undefined;
            state.status = STATUS.UNSET;
        },
        getWalletLayer2Status(state, action: PayloadAction<{ walletLayer2:WalletLayer2Map<object> }>) {
            // @ts-ignore
            if (action.error) {
                state.status =  STATUS.ERROR
                // @ts-ignore
                state.errorMessage = action.error
            }
            state.walletLayer2 = {...action.payload.walletLayer2};
            state.status = STATUS.DONE
        },
        statusUnset: state => {
            state.status = STATUS.UNSET
        }
    },
});
export { walletLayer2Slice };
export const {  updateWalletLayer2,getWalletLayer2Status,statusUnset,reset } = walletLayer2Slice.actions