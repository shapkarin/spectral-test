
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Actions from './Actions';

export default function Wallet({ address, balance, master, toMaster, disconnected, disconnect }) {
  return (
    <ListItem 
      secondaryAction={
        <Actions master={master} disconnected={disconnected} toMaster={toMaster} address={address} disconnect={disconnect} />
      }
    >
      <ListItemText
        primary={address}
        secondary={`Balance: ${balance}`}
      />
    </ListItem>
  )
}

