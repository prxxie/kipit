import { AppBar, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { memo } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectListNotes } from "../../store/slices/noteSlice";

export interface SidebarProps {
  width: number;
}

const Sidebar = (props: SidebarProps) => {
  const listNotes = useAppSelector(selectListNotes)

  const { width } = props;
  return (
    <Drawer
      sx={{
        display: { md: 'block', xs: 'none' },
        width: width,
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
      }}
      variant="persistent"
      anchor="left"
      open={true}
    >
      <AppBar position="sticky" sx={{ backgroundColor: 'white', boxShadow: 'none', borderBottom: '1px solid #aaa' }}>
        <Toolbar >
          <Typography variant="h4" sx={{ color: '#ad2a2a' }}>KIPIT</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <List>
          {
            listNotes.map(note => (
              <Link href={`/note/${note.id}`} key={note.id}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText sx={{ overflow: 'hidden' }} primary={note.title} secondary={note.content} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))
          }
        </List>
      </Box>
    </Drawer>
  )
}

export default memo(Sidebar)