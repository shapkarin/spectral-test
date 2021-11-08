import Button from '@mui/material/Button';

interface IConnectButtonProps {
  onClick?: any;
}

const ConnectButton = (props: IConnectButtonProps) => (
  <Button
    variant="contained"
    {...props}
  >
    {"Connect"}
  </Button>
);

ConnectButton.defaultProps = {
  disabled: false,
  icon: null,
};

export default ConnectButton;
