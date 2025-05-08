import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

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
      disabled={true}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | ' +
          'alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | removeformat | image media link | help' +
          '|code',
        file_picker_types: 'image',
        file_picker_callback: (callback) => {
          const input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'image/*')
          input.onchange = function () {
            const file = (this as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = function () {
                const url = reader.result?.toString()
                if (url) {
                  callback(url, { title: file.name })
                }
              }
              reader.readAsDataURL(file)
            }
          }
          input.click()
        },
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
      }}
    />
  )
}
