import { Box, SxProps } from "@mui/system"
import { TextField } from "mui-rff";
import { memo, useEffect } from "react";
import { Form } from "react-final-form";
import { Autosave } from "../components/Autosave";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { actionEditNote, getNote, updateCurrentNote } from "../store/slices/noteSlice";
import { supabase } from "../utils/supabaseClient";

const textFieldStyle: SxProps = {
  ' .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}

interface FormData {
  title: string;
  content: string;
}

interface NoteFormProps {
  id: number;
}

const NoteForm = ({ id }: NoteFormProps) => {
  const dispatch = useAppDispatch();
  const ready = useAppSelector(state => state.note.ready)
  const currentNote = useAppSelector(state => state.note.currentNote)

  useEffect(() => {
    id && dispatch(getNote(id))
    supabase
      .channel('public:main_notes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'main_notes', filter: `id=eq.${id}` }, payload => {
          dispatch(updateCurrentNote(payload.new))
      })
      .subscribe()
  }, [id])



  async function save(values: FormData) {
    dispatch(actionEditNote({ id: currentNote ? currentNote.id : 0, ...values }))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Form
        onSubmit={() => { }}
        initialValues={{
          title: currentNote?.title,
          content: currentNote?.content
        }}
        render={({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <TextField sx={{ ...textFieldStyle, fontWeight: 'bold' }} name="title" placeholder="Title" disabled={!ready} />
            <TextField sx={textFieldStyle} name="content" placeholder="Content" multiline disabled={!ready} />
            <Autosave debounce={300} save={save} />
          </form>
        )}
      />
    </Box>
  )
}

export default NoteForm