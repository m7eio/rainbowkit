import React from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useMainnetEnsAvatar } from '../../hooks/useMainnetEnsAvatar';
import { useMainnetEnsName } from '../../hooks/useMainnetEnsName';
import { Dialog } from '../Dialog/Dialog';
import { DialogContent } from '../Dialog/DialogContent';
import { ProfileDetails } from '../ProfileDetails/ProfileDetails';
import { AppContext } from '../RainbowKitProvider/AppContext';

export interface AccountModalProps {
  open: boolean;
  onClose: () => void;
}

export function AccountModal({ onClose, open }: AccountModalProps) {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ addressOrName: address });
  const ensAvatar = useMainnetEnsAvatar(address);
  const ensName = useMainnetEnsName(address);
  const { disconnect } = useDisconnect();
  const { onEditProfile, onViewProfile } = React.useContext(AppContext);

  const viewProfileHandler = React.useCallback(() => {
    if (onViewProfile) {
      onViewProfile();
    }
  }, [onViewProfile]);

  const editProfileHandler = React.useCallback(() => {
    if (onEditProfile) {
      onEditProfile();
    }
  }, [onEditProfile]);

  if (!address) {
    return null;
  }

  const titleId = 'rk_account_modal_title';

  return (
    <>
      {address && (
        <Dialog onClose={onClose} open={open} titleId={titleId}>
          <DialogContent bottomSheetOnMobile padding="0">
            <ProfileDetails
              address={address}
              balanceData={balanceData}
              ensAvatar={ensAvatar}
              ensName={ensName}
              onClose={onClose}
              onDisconnect={disconnect}
              onEditProfile={editProfileHandler}
              onViewProfile={viewProfileHandler}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
