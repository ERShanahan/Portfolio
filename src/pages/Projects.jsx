import React from "react";
import { motion } from "framer-motion";
import "./Projects.css";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const projects = [
  {
    title: "American Sign Interpreter",
    description: "American Sign Interpreter",
    imageUrl: "/images/asl.jpg",
    link: "https://asi-eosin.vercel.app"
  },
  {
    title: "Physics Sim",
    description: "Particle Simulation in C for Windows",
    imageUrl: "/images/physics.png",
    link: "https://github.com/ERShanahan/Physics"
  },
  {
    title: "File System from Scratch",
    description: "File System Skeleton: Project for Operating Systems at Stevens Institute of Technology",
    imageUrl: "/images/fs.png",
    link: "https://github.com/ERShanahan/Basic_FileSystem"

  }
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white projects-container">
      <Header />
      {/* Hero Section */}
      <div
        className="h-screen bg-fixed bg-center bg-cover flex flex-col justify-center items-center"
        style={{ backgroundImage: "url('/images/port_background.jpg')" }}
      >
        <div className="bg-black bg-opacity-60 p-6 rounded-xl shadow-2xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
            Projects
          </h1>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex flex-col w-full">
        {projects.map((project, index) => (
          <div className="flex flex-col md:flex-row w-full h-64" key={index}>
            {/* Left: image with sliding blue cover */}
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group clip-left w-full md:w-1/2 h-full overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="image-overlay" />
            </motion.a>

            {/* Right: description panel */}
            <div className="clip-right md:w-1/2 h-full p-6 flex items-center justify-center">
              <p className="text-lg text-center md:text-left">
                {project.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}