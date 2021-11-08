import { useState } from 'react';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

export default function WalletActions({ master, disconnected, toMaster, address, disconnect }) {
  const [open, setOpen] = useState(false);

  return <div style={{ width: 100 }}>
    <Button
      id="composition-button"
      aria-controls={open ? 'composition-menu' : undefined}
      aria-expanded={open ? 'true' : undefined}
      aria-haspopup="true"
      onClick={() => setOpen((prevOpen) => !prevOpen)}
    >
      Actions
    </Button>
    <Popper
      open={open}
      role={undefined}
      placement="bottom-start"
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'bottom-start' ? 'left top' : 'left bottom',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={() => setOpen(false)}>
              <MenuList
                autoFocusItem={open}
                id="composition-menu"
                aria-labelledby="composition-button"
              >
                {!master && <MenuItem onClick={() => toMaster(address)}>Make master</MenuItem>}
                {master && <MenuItem onClick={() => disconnect(address)}>{'Disconnect'}</MenuItem>}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  </div>
}