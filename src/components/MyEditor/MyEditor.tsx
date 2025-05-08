import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'
import tinymce from 'tinymce'

interface MyEditorProps {
  value: string
  onChange: (content: string) => void
}

export default function MyEditor({ value, onChange }: MyEditorProps) {
  const editorRef = useRef<any>(null)
  return (
    <Editor
      apiKey='6exkcycuzl4n4cx1xx4333jpg4l4ahsk8nxrjw2d1kveux33'
      onInit={(_, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={onChange}
      init={{
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        file_picker_types: 'file image media',
        block_unsupported_drop: false,
        file_picker_callback: (cb) => {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')

          input.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.addEventListener('load', () => {
                const id = 'blobid' + new Date().getTime()
                const blobCache = (tinymce.activeEditor as any).editorUpload.blobCache
                const base64 = (reader.result as string).split(',')[1]
                const blobInfo = blobCache.create(id, file, base64)
                blobCache.add(blobInfo)

                /* call the callback and populate the Title field with the file name */
                cb(blobInfo.blobUri(), { title: file.name })
              })
              reader.readAsDataURL(file)
            }
          })

          input.click()
        },
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
      }}
    />
  )
}
