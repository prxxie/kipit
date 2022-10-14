import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";
import { Provider, Session } from "@supabase/supabase-js";
import { AppState } from "../store";

export interface INote {
  id?: number | null;
  title?: string;
  content?: string;
  synced?: boolean;
}

export interface NoteState {
  listNotes: INote[];
  currentNote: INote | null;
  ready: boolean;
}

const initialState: NoteState = {
  listNotes: [],
  currentNote: null,
  ready: false
};

export const getListNotes = createAsyncThunk(
  'note/getListNotes',
  async () => {
    const { data, error } = await supabase.from('main_notes').select().order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return data
  }
)

export const syncNote = createAsyncThunk(
  'note/syncNote',
  async (note: INote) => {
    const { id, title, content } = note
    const { data, error } = await supabase
      .from('main_notes')
      .upsert(id ? note : { title, content })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }
)

export const getNote = createAsyncThunk(
  'note/getNote',
  async (id: number) => {
    const { data, error } = await supabase.from('main_notes').select().eq('id', id).single()

    if (error) {
      throw error
    }

    return data
  }
)

export const updateNote = createAsyncThunk(
  'note/updateNote',
  async (id: number) => {
    const { data, error } = await supabase.from('main_notes').select().eq('main_notes.id', id).single()

    if (error) {
      throw error
    }

    return data
  }
)

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    updateCurrentNote(state, action: PayloadAction<INote>) {
      state.currentNote = action.payload
    },
    prepareNewNote(state) {
      const newNote = {
        id: 0,
        title: 'New note',
        content: '...',
        synced: false,
      }

      state.listNotes.unshift(newNote)
      state.currentNote = initialState.currentNote
    },
    refresh(state) {
      const indexEditingNote = state.listNotes.findIndex(note => note.id === 0)
      indexEditingNote >= 0 && state.listNotes.splice(indexEditingNote, 1)
      state.currentNote = initialState.currentNote
    },
    updateNoteList(state, action: PayloadAction<INote>) {
      const { id, title, content } = action.payload
      const indexEditingNote = state.listNotes.findIndex(note => note.id === id)
      const editingNote = state.listNotes[indexEditingNote]

      if (!editingNote) return;

      editingNote.title = title
      editingNote.content = content
    },
    updateNoteListAfterCreated(state, action: PayloadAction<INote>) {
      const indexEditingNote = state.listNotes.findIndex(note => note.id === 0)
      state.listNotes[indexEditingNote] = action.payload
      state.currentNote = action.payload
    }
  },

  extraReducers: (builder: ActionReducerMapBuilder<NoteState>) => {
    builder
      .addCase(syncNote.fulfilled, (state, action) => {
        const id: number = action.payload?.id

        state.currentNote = { ...state.currentNote, id }
      })
      .addCase(getListNotes.fulfilled, (state, action) => {
        const listNotes = action.payload

        state.listNotes = listNotes
        state.ready = true
      })
      .addCase(getNote.fulfilled, (state, action) => {
        const note = action.payload

        state.currentNote = note
      })
  },
});

export const { updateCurrentNote, updateNoteListAfterCreated, updateNoteList, prepareNewNote, refresh } = noteSlice.actions


export const actionEditNote = (newNote: INote) => async (dispatch: any) => {
  const prevId = newNote.id

  const { payload, error } = await dispatch(syncNote(newNote))

  if (!error && prevId === 0)
    return await dispatch(updateNoteListAfterCreated({ ...newNote, id: payload.id }))

  return await dispatch(updateNoteList(newNote))
}

export const selectListNotes = (state: AppState) => state.note.listNotes

export default noteSlice.reducer;