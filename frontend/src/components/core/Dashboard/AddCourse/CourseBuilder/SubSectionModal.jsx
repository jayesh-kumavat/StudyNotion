import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import {createSubSection, updateSubSection} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import { apiConnector } from "../../../../../services/apiconnector"
import { featuresEndpoints } from "../../../../../services/apis"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"


export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  useEffect(() => {
    if (view || edit) {
      // console.log("modalData", modalData)
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData()
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo)
    }
    setLoading(true)
    const result = await updateSubSection(formData, token)
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    // console.log(data)
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        // Still allow close even if only resources were changed
        setModalData(null)
      } else {
        handleEditSubsection()
      }
      return
    }

    const formData = new FormData()
    formData.append("sectionId", modalData)
    formData.append("title", data.lectureTitle)
    formData.append("description", data.lectureDesc)
    formData.append("video", data.lectureVideo)
    setLoading(true)
    const result = await createSubSection(formData, token)
    if (result) {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>

          {/* Resources Section (only in edit/view mode) */}
          {(edit || view) && (
            <ResourceSection
              subsectionId={modalData._id}
              resources={modalData.resources || []}
              token={token}
              view={view}
            />
          )}

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}


function ResourceSection({ subsectionId, resources, token, view }) {
  const [resourceList, setResourceList] = useState(resources)
  const [file, setFile] = useState(null)
  const [name, setName] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file || !name.trim()) {
      toast.error("File and name are required")
      return
    }
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("subsectionId", subsectionId)
      formData.append("name", name)
      formData.append("resource", file)
      const res = await apiConnector("POST", featuresEndpoints.ADD_RESOURCE_API, formData, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })
      if (res?.data?.success) {
        setResourceList(res.data.data.resources)
        setFile(null)
        setName("")
        toast.success("Resource added")
      }
    } catch (e) { toast.error("Failed to upload resource") }
    setUploading(false)
  }

  const handleDelete = async (resourceId) => {
    try {
      const res = await apiConnector("POST", featuresEndpoints.DELETE_RESOURCE_API, {
        subsectionId, resourceId,
      }, { Authorization: `Bearer ${token}` })
      if (res?.data?.success) {
        setResourceList(res.data.data.resources)
        toast.success("Resource deleted")
      }
    } catch (e) { toast.error("Failed to delete resource") }
  }

  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm text-richblack-5">
        Resources (PDFs, files)
      </label>

      {/* Existing resources */}
      {resourceList.length > 0 && (
        <div className="flex flex-col gap-2">
          {resourceList.map((res) => (
            <div key={res._id} className="flex items-center justify-between rounded bg-richblack-700 px-3 py-2">
              <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-sm text-caribbeangreen-100 hover:underline">
                📄 {res.name}
              </a>
              {!view && (
                <button type="button" onClick={() => handleDelete(res._id)}>
                  <RiDeleteBin6Line className="text-pink-200 hover:text-pink-100" size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload new resource */}
      {!view && (
        <div className="flex flex-col gap-2 rounded bg-richblack-700 p-3">
          <input
            type="text"
            placeholder="Resource name (e.g. Lecture Notes)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded bg-richblack-600 px-3 py-2 text-sm text-richblack-5 outline-none"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm text-richblack-100"
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="w-fit rounded bg-yellow-50 px-4 py-1 text-sm font-semibold text-richblack-900 hover:bg-yellow-100 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Resource"}
          </button>
        </div>
      )}
    </div>
  )
}
