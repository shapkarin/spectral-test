import List from '@mui/material/List';

import Wallet from '../Wallet';

export default function Wallets({ wallets, toMaster, disconnect }) {
  return wallets.length ? <div style={{ width: 540 }}>
    <h3>Wallets</h3>
    <List>
      {wallets.map((props) => <Wallet {...props} toMaster={toMaster} disconnect={disconnect} />)}
    </List>
  </div> : null
}