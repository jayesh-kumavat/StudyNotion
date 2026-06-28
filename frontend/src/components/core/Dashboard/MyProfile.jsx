import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { RiEditBoxLine } from "react-icons/ri"
import { FadeIn } from "../../ui/Animations"
import IconBtn from "../../common/IconBtn"


export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <FadeIn>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Profile
        </h1>
      </FadeIn>

      {/* Section 1 - Profile Info */}
      <FadeIn delay={0.1}>
        <div className="glass-card p-6 flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[78px] rounded-full object-cover border-4 border-indigo-500/20"
            />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
          <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
            <RiEditBoxLine />
          </IconBtn>
        </div>
      </FadeIn>

      {/* Section 2 - About */}
      <FadeIn delay={0.2}>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">About</p>
            <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
              <RiEditBoxLine />
            </IconBtn>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {user?.additionalDetails?.about ?? "Write Something About Yourself"}
          </p>
        </div>
      </FadeIn>

      {/* Section 3 - Personal Details */}
      <FadeIn delay={0.3}>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Personal Details</p>
            <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")}>
              <RiEditBoxLine />
            </IconBtn>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "First Name", value: user?.firstName },
              { label: "Last Name", value: user?.lastName },
              { label: "Email", value: user?.email },
              { label: "Phone Number", value: user?.additionalDetails?.contactNumber ?? "Add Contact Number" },
              { label: "Gender", value: user?.additionalDetails?.gender ?? "Add Gender" },
              { label: "Date Of Birth", value: user?.additionalDetails?.dateOfBirth ?? "Add Date Of Birth" },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-200">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </motion.div>
  )
}
