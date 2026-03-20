import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import Navbar from "../components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brook" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => {
        const data = JSON.parse(resume.value);
        return data as Resume;
      });
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get started.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}
        {resumes.length > 0 && !loadingResumes && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
      <footer className="footer text-gray-400 hover:text-purple-400 transition duration-300">
        <div className="flex flex-col items-center gap-3">
           <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
             Smart AI Resume Analyzer 🚀
            </h2>
      <h3 className="text-gray-400 text-sm hover:text-purple-400 transition duration-300">
        made with passion 🔥 by k0, L4, L7, M8 and N5 🔥
      </h3>
      <div className="flex gap-4 mt-2">
      <a 
        href="https://github.com/GaneshMaruti77" 
        target="_blank"
        className="text-gray-400 hover:text-white transition"
      >
        GitHub
      </a>
      </div>
      </div>
    </footer>
    </main>
    
  );
  }
  

