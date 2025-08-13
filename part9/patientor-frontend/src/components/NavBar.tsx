import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography component="div" sx={{ flexGrow: 1 }} variant="h6">
          Patientor
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">Patients</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;