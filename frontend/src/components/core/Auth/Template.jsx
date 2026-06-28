import { motion } from "framer-motion"
import { FadeIn } from "../../ui/Animations"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formType }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-items-center py-12">
      <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 md:flex-row md:gap-y-0 md:gap-x-12">
        {/* Form Section */}
        <FadeIn direction="left" className="mx-auto w-11/12 max-w-[450px]">
          <div className="glass-card p-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-3 text-sm">
              <span className="text-slate-600 dark:text-slate-400">{description1}</span>{" "}
              <span className="font-medium italic gradient-text">{description2}</span>
            </p>
            <div className="mt-8">
              {formType === "signup" ? <SignupForm /> : <LoginForm />}
            </div>
          </div>
        </FadeIn>

        {/* Image Section */}
        <FadeIn direction="right" className="relative mx-auto w-11/12 max-w-[450px]">
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            src={image}
            alt=""
            className="relative rounded-2xl w-full object-cover shadow-[10px_10px_0px_0px_rgba(99,102,241,0.3)] dark:shadow-[10px_10px_0px_0px_rgba(129,140,248,0.25)]"
          />
        </FadeIn>
      </div>
    </div>
  )
}

export default Template
