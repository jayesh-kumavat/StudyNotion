import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"


export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  // const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const [useUrl, setUseUrl] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      if (video) {
        setPreviewSource(URL.createObjectURL(file))
      } else {
        previewFile(file)
      }
      setSelectedFile(file)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  })

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  useEffect(() => {
    register(name, { required: true })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register])

  useEffect(() => {
    setValue(name, selectedFile)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile, setValue])

  const handleUrlSubmit = () => {
    if (!imageUrl) return
    setPreviewSource(imageUrl)
    setValue(name, imageUrl)
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* Toggle between upload and URL */}
      {!video && !viewData && (
        <div className="flex gap-4 text-xs">
          <button
            type="button"
            onClick={() => setUseUrl(false)}
            className={`px-3 py-1 rounded ${!useUrl ? "bg-yellow-50 text-richblack-900 font-semibold" : "bg-richblack-700 text-richblack-200"}`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUseUrl(true)}
            className={`px-3 py-1 rounded ${useUrl ? "bg-yellow-50 text-richblack-900 font-semibold" : "bg-richblack-700 text-richblack-200"}`}
          >
            Use Image URL
          </button>
        </div>
      )}

      {/* URL Input */}
      {useUrl && !video ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image URL (e.g., https://images.unsplash.com/...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="form-style flex-1"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="rounded bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900"
            >
              Preview
            </button>
          </div>
          {previewSource && (
            <div className="flex flex-col">
              <img
                src={previewSource}
                alt="Preview"
                className="h-[200px] w-full rounded-md object-cover"
                onError={() => setPreviewSource("")}
              />
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("")
                  setImageUrl("")
                  setValue(name, null)
                }}
                className="mt-3 text-richblack-400 underline text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        /* File Upload */
        <div
          className={`${
            isDragActive ? "bg-richblack-600" : "bg-richblack-700"
          } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
        >
          {previewSource ? (
            <div className="flex w-full flex-col p-6">
              {!video ? (
                <img
                  src={previewSource}
                  alt="Preview"
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                <video
                  src={previewSource}
                  controls
                  className="aspect-video w-full rounded-md"
                />
              )}
              {!viewData && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewSource("")
                    setSelectedFile(null)
                    setValue(name, null)
                  }}
                  className="mt-3 text-richblack-400 underline"
                >
                  Cancel
                </button>
              )}
            </div>
          ) : (
            <div
              className="flex w-full flex-col items-center p-6"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                <FiUploadCloud className="text-2xl text-yellow-50" />
              </div>
              <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                Drag and drop an {!video ? "image" : "video"}, or click to{" "}
                <span className="font-semibold text-yellow-50">Browse</span> a
                file
              </p>
              <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
                <li>Aspect ratio 16:9</li>
                <li>Recommended size 1024x576</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
