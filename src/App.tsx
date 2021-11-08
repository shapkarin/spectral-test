import React from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import useApp from './useApp';
import ConnectButton from './Components/ConnectButton';
import Wallets from './Components/Wallets';
import Header from './Components/Header';

import './App.css';

function App() {
  const {
    state: {
      address,
      connected,
      chainId,
    },
    wallets,
    methods: {
      onConnect,
      resetApp,
      toMaster,
      disconnect,
    },
  } = useApp();

  return (
    <Box sx={{ padding: 2 }}>
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: 'dark',
          },
        })}
      >
        {connected && <Header
          connected={connected}
          address={wallets[0]?.address}
          chainId={chainId}
          killSession={resetApp}
          balance={wallets[0]?.balance}
        />}
        {!connected && <ConnectButton onClick={onConnect} />}
      </ThemeProvider>
      <Wallets wallets={wallets} toMaster={toMaster} disconnect={disconnect} />
    </Box>
  );
}

export default App;
