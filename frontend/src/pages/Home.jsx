import { FaArrowRight } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState } from "react"
import Banner from "../assets/Images/banner.mp4"
import Footer from "../components/common/Footer"
import ReviewSlider from "../components/common/ReviewSlider"
import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from "../components/core/HomePage/TimelineSection"
import RecommendedCourses from "../components/core/HomePage/RecommendedCourses"
import { ScrollReveal, FadeIn } from "../components/ui/Animations"



function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      {/* Hero Section */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-slate-900 dark:text-white pt-12">

        <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Become Instructor Button */}
        <FadeIn>
          <Link to="/signup">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group mx-auto w-fit rounded-full glass p-1 font-bold text-slate-600 dark:text-slate-300 shadow-lg transition-all duration-200"
            >
              <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-800">
                <p>Become an Instructor</p>
                <FaArrowRight />
              </div>
            </motion.div>
          </Link>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.1}>
          <div className="text-center text-4xl md:text-5xl font-bold leading-tight">
            Empower Your Future with{" "}
            <span className="gradient-text">Coding Skills</span>
          </div>
        </FadeIn>

        {/* Sub Heading */}
        <FadeIn delay={0.2}>
          <div className="-mt-3 w-[90%] text-center text-lg font-medium text-slate-600 dark:text-slate-400">
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a wealth of resources,
            including hands-on projects, quizzes, and personalized feedback from
            instructors.
          </div>
        </FadeIn>

        {/* Search Bar */}
        <FadeIn delay={0.25}>
          <form onSubmit={handleSearch} className="w-full max-w-[600px] mt-2">
            <div className="flex items-center rounded-full bg-white dark:bg-richblack-800 border border-slate-200 dark:border-richblack-600 shadow-lg overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses..."
                className="flex-1 px-6 py-3 text-sm bg-transparent text-slate-900 dark:text-richblack-5 outline-none placeholder:text-slate-400 dark:placeholder:text-richblack-300"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-50 text-richblack-900 font-semibold text-sm hover:bg-yellow-100 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </FadeIn>

        {/* CTA Buttons */}
        <FadeIn delay={0.3}>
          <div className="mt-4 flex flex-row gap-4">
            <CTAButton active={true} linkto="/about">
              Learn More
            </CTAButton>
            <CTAButton active={false} linkto="/contact">
              Book a Demo
            </CTAButton>
          </div>
        </FadeIn>


        {/* Video */}
        <ScrollReveal className="w-full">
          <div className="mx-3 my-7 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700">
            <video
              className="w-full"
              muted
              loop
              autoPlay
            >
              <source src={Banner} type="video/mp4" />
            </video>
          </div>
        </ScrollReveal>

        {/* Code Section 1 */}
        <ScrollReveal>
          <CodeBlocks
            position="lg:flex-row"
            heading={
              <div className="text-3xl md:text-4xl font-bold">
                Unlock your{" "}
                <span className="gradient-text">coding potential</span> with our online courses.
              </div>
            }
            subheading="Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            ctabtn1={{ btnText: "Try it Yourself", link: "/catalog", active: true }}
            ctabtn2={{ btnText: "Learn More", link: "/about", active: false }}
            codeColor="text-amber-400"
            codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
            backgroundGradient={<div className="codeblock1 absolute"></div>}
          />
        </ScrollReveal>


        {/* Code Section 2 */}
        <ScrollReveal>
          <CodeBlocks
            position="lg:flex-row-reverse"
            heading={
              <div className="w-[100%] text-3xl md:text-4xl font-bold lg:w-[50%]">
                Start{" "}
                <span className="gradient-text">coding in seconds</span>
              </div>
            }
            subheading="Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            ctabtn1={{ btnText: "Continue Lesson", link: "/catalog", active: true }}
            ctabtn2={{ btnText: "Learn More", link: "/about", active: false }}
            codeColor="text-emerald-400"
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </ScrollReveal>


        {/* Explore Section */}
        <ScrollReveal className="w-full">
          <ExploreMore />
        </ScrollReveal>
      </div>


      {/* Section 2 */}
      <div className="bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white mt-20">
        <div className="homepage_bg h-[320px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 lg:mt-8">
              <CTAButton active={true} linkto="/catalog">
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto="/about">
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
          <ScrollReveal className="w-full">
            <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
              <div className="text-3xl md:text-4xl font-bold lg:w-[45%]">
                Get the skills you need for a{" "}
                <span className="gradient-text">job that is in demand.</span>
              </div>
              <div className="flex flex-col items-start gap-10 lg:w-[40%]">
                <div className="text-[16px] text-slate-600 dark:text-slate-400">
                  The modern StudyNotion dictates its own terms. Today, to
                  be a competitive specialist requires more than professional skills.
                </div>
                <CTAButton active={true} linkto="/about">
                  Learn More
                </CTAButton>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="w-full">
            <TimelineSection />
          </ScrollReveal>

          <ScrollReveal className="w-full">
            <LearningLanguageSection />
          </ScrollReveal>
        </div>
      </div>



      {/* Section 3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
        <ScrollReveal className="w-full">
          <InstructorSection />
        </ScrollReveal>

        <ScrollReveal className="w-full">
          <h1 className="text-center text-3xl md:text-4xl font-bold mt-8 text-slate-900 dark:text-white">
            Reviews from other learners
          </h1>
          <ReviewSlider />
        </ScrollReveal>

        <ScrollReveal className="w-full">
          <RecommendedCourses />
        </ScrollReveal>
      </div>

      <Footer />
    </motion.div>
  )
}

export default Home
