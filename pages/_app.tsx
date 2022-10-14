import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { AppProps } from 'next/app'
import { Box, Button, Dialog, DialogContent, Toolbar } from '@mui/material'
import { wrapper } from '../store/store'
import { memo, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { getProfile, signInWithOAuth } from '../store/slices/authSlice'


import { supabase } from '../utils/supabaseClient'
import { getListNotes, getNote, updateCurrentNote } from '../store/slices/noteSlice'
import Header from '../components/layouts/Header';
import Sidebar from '../components/layouts/Sidebar';

const sidebarWidth = 240;

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch()
  const { authState, userId } = useAppSelector(state => state.auth)
  const currentNote = useAppSelector(state => state.note.currentNote)

  const [openAuthDialog, setOpenAuthDialog] = useState(false)

  useEffect(() => {
    !authState && dispatch(getProfile())
    setOpenAuthDialog(!authState)

    if (authState) {
      console.log(authState);

      dispatch(getListNotes())

      supabase
        .channel('public:main_notes')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'main_notes', filter: `user_id=eq.${userId}` }, payload => {
          const newUpdate = payload.new
          dispatch(getListNotes())
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'main_notes' }, payload => {
          console.log('Change received!', payload)
          dispatch(getListNotes())
        })
        .subscribe()
    }
  }, [authState])

  return (
    <Box>
      <Header />
      <Box
        sx={{ display: 'flex' }}
      >
        <Sidebar width={sidebarWidth} />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3 }}
        >
          {authState && <Component {...pageProps} />}
        </Box>
      </Box>

      <Dialog open={openAuthDialog}>
        <DialogContent>
          <Button onClick={() => dispatch(signInWithOAuth('github'))}>Login via Github</Button>
        </DialogContent>

      </Dialog>
    </Box>
  )
}

export default wrapper.withRedux(memo(MyApp));
