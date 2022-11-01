import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

import { firebaseStorage } from '@/firebase'

const metadata = {
  contentType: 'image/jpeg',
}

export const uploadFile = ({ file, path }: { file: any; path: string }) => {
  const storageRef = ref(firebaseStorage, path)
  const uploadTask = uploadBytesResumable(storageRef, file, metadata)

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    },
    (error) => {
      switch (error.code) {
        case 'storage/unauthorized':
          console.warn("User doesn't have permission to access the object")
          break
        case 'storage/canceled':
          console.warn('User canceled the upload')
          break
        case 'storage/unknown':
          console.warn(`Unknown error occured ${error.serverResponse}`)
          break
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log(
          `Uploaded file succesfully, file is available at: ${downloadURL}`
        )
      })
    }
  )
}
