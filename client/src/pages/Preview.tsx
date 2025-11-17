import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { dummyResumeData } from "../assets/assets";
import Loader from "../components/Loader";
import ResumePreview from "../components/ResumePreview";
import { ArrowLeftIcon } from "lucide-react";

const Preview = () => {

  const {resumeId} = useParams();
  const [resumeData, setResumeData] = useState<any>(null);
const [isLoading, setIsLoading] = useState(true)
useEffect(()=>{
    const loadResume = async()=> {
    setResumeData(dummyResumeData.find(resume=> resume._id === resumeId || null))
    setIsLoading(false)
  }
  loadResume()
},[])
  return resumeData ? (
    <div className="bg-slate-100">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview data={resumeData} accentColor={resumeData.accent_color} template={resumeData.template} classes="py-4 bg-white"/>
      </div>
    </div>
  ) : (
    <div>
      {isLoading? <Loader /> : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-center text-6xl text-slate-400 font-medium">Resume not found</p>
          <a href="/" className="mt-6 bg-violet-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-violet-400 flex items-center transition-colors">
            <ArrowLeftIcon className="size-4 mr-2" />
            go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview