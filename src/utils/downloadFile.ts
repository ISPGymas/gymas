import { ref, getDownloadURL } from 'firebase/storage'
import { firebaseStorage } from '@/firebase'

export const downloadFile = (filePath: string) => {
  const fileRef = ref(firebaseStorage, filePath)

  return getDownloadURL(fileRef)
}
