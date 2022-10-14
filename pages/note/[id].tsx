import { useRouter } from "next/router"
import NoteForm from "../../components/NoteForm";

export default function EditNote() {
  const router = useRouter()
  const { id } = router.query

  return typeof id === 'string' ? <NoteForm id={parseInt(id)} /> : null
}