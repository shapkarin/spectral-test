import List from '@mui/material/List';

import Wallet from '../Wallet';

const items = [...Array(5)].map((_, i) => ({
  address: `eth_${Math.floor(Math.random() * 1000000000000)}`,
  ballance: Math.random(),
  master: i === 0 ? true : false,
  disconnected: i === 4 ? true : false,
}));

export default function Wallets() {
  return <div style={{ width: 400 }}>
    <List>
      {items.map((props) => <Wallet {...props} />)}
    </List>
  </div>
}