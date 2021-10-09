import { useDispatch, useSelector } from 'react-redux'
import { updateWithdrawData, updateTransferData, updateDepositData, 
    resetWithdrawData, resetTransferData, resetDepositData, } from './reducer';
import { WithdrawData, TransferData, DepositData, ModalDataStatus, } from './interface';
import React from 'react';
import { RequireOne } from '@loopring-web/common-resources';
import { RootState } from 'stores';

export function useModalData(): ModalDataStatus & {
    updateWithdrawData: (withdrawData: RequireOne<WithdrawData, never>) => void,
    updateTransferData: (transferData: RequireOne<TransferData, never>) => void,
    updateDepositData: (depositData: RequireOne<DepositData, never>) => void,
    resetWithdrawData: () => void,
    resetTransferData: () => void,
    resetDepositData: () => void,
} {
    const modalDataStatus: ModalDataStatus = useSelector((state: RootState) => state._router_modalData)
    const dispatch = useDispatch();

    return {
        ...modalDataStatus,
        updateWithdrawData: React.useCallback((withdrawData: RequireOne<WithdrawData, never>) => {
            dispatch(updateWithdrawData(withdrawData))
        }, [dispatch]),
        updateTransferData: React.useCallback((transferData: RequireOne<TransferData, never>) => {
            dispatch(updateTransferData(transferData))
        }, [dispatch]),
        updateDepositData: React.useCallback((depositData: RequireOne<DepositData, never>) => {
            dispatch(updateDepositData(depositData))
        }, [dispatch]),
        resetWithdrawData: React.useCallback(() => {
            dispatch(resetWithdrawData(undefined))
        }, [dispatch]),
        resetTransferData: React.useCallback(() => {
            dispatch(resetTransferData(undefined))
        }, [dispatch]),
        resetDepositData: React.useCallback(() => {
            dispatch(resetDepositData(undefined))
        }, [dispatch])
    }

}