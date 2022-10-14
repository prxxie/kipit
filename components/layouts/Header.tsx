import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import ListIcon from '@mui/icons-material/List';
import { memo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Link from 'next/link';
import { signOut } from '../../store/slices/authSlice';

const Header = () => {
  const dispatch = useAppDispatch()
  const { username } = useAppSelector(state => state.auth)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #aaa' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: { md: 'none', xs: 'flex' } }}>
              <Typography variant="h4" sx={{ color: '#ad2a2a' }}>KIPIT</Typography>
              <IconButton aria-label="open list notes">
                <ListIcon />
              </IconButton>
            </Box>
          </Box>
          <Link href="/note/create">
            <IconButton aria-label="add new" component="a">
              <AddIcon />
            </IconButton>
          </Link>
          <Button onClick={() => dispatch(signOut())}>{username}</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default memo(Header)