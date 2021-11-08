import * as React from "react";
import styled from "styled-components";
import * as PropTypes from "prop-types";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { ellipseAddress, getChainData } from "../helpers/utilities";

interface IHeaderProps {
  killSession: () => void;
  connected: boolean;
  address: string;
  chainId: number;
  balance: string;
}

const Header = (props: IHeaderProps) => {
  const { connected, address, chainId, killSession, balance } = props;
  const chainData = chainId ? getChainData(chainId) : null;
  return (
    
      <AppBar position="static">
      <Box sx={{ padding: 2 }}>
        <Toolbar>
          {address && balance && (
            <div style={{ marginRight: 42 }}>
              {`Connected to`}<br/>
              {chainData?.name}
            </div>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Test App
          </Typography>
          {address && balance && (
            <>
              <div style={{ marginRight: 15 }}>
                {'Master: '}{ellipseAddress(address)}<br/>
                {'Balance: '}{balance}
              </div>
              <Button variant="outlined" color="secondary" onClick={killSession}>
                {'LogOut'}
              </Button>
            </>
          )}
        </Toolbar>
        </Box>
      </AppBar>
    
  );
};

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string,
};

export default Header;
