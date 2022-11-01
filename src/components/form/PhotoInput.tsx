import { CloudUploadOutlined } from '@ant-design/icons'
import { IconButton, Input } from '@chakra-ui/react'
import { ChangeEvent, createRef } from 'react'

type PhotoFieldProps = {
  name: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const PhotoField = ({ name, onChange }: PhotoFieldProps) => {
  const fileRef = createRef<HTMLInputElement>()

  return (
    <>
      <Input
        name={name}
        accept='image/*'
        hidden
        ref={fileRef}
        type='file'
        onChange={onChange}
      />
      <IconButton
        aria-label='Upload image'
        size='lg'
        icon={<CloudUploadOutlined />}
        w='full'
        onClick={() => fileRef.current?.click()}
      ></IconButton>
    </>
  )
}

export default PhotoField
