import { useEffect } from "react";
import NoteForm from "../../components/NoteForm";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { prepareNewNote, refresh } from "../../store/slices/noteSlice";

function CreateNote() {
  const dispatch = useAppDispatch()
  const ready = useAppSelector(state => state.note.ready)

  useEffect(() => {
    ready && dispatch(prepareNewNote())

    return () => {
      dispatch(refresh())
    }
  }, [ready])


  return <NoteForm id={0} />
}

export default CreateNote