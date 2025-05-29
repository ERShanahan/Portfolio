import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const widgets = [
    { title: "Projects", onClick: () => navigate("/projects") },
    { title: "Chess", onClick: () => navigate("/chess") },
    // You can add more widgets here later
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">

      {/* Parallax Background Header */}
      <div
        className="h-screen bg-fixed bg-center bg-cover flex flex-col justify-center items-center"
        style={{ backgroundImage: "url('/images/port_background.jpg')" }}
      >
        <div className="bg-black bg-opacity-60 p-6 rounded-xl shadow-2xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
            Ethan Shanahan
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-gray-300">
            Stevens Institute of Technology
          </p>
          <p className="mt-4 text-lg md:text-2xl text-gray-300">
            Hoboken, NJ
          </p>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 md:p-16">
        {widgets.map((widget, index) => (
          <motion.div
            key={index}
            className="bg-black/50 hover:bg-black/70 rounded-2xl p-8 shadow-lg backdrop-blur-sm border border-gray-700 cursor-pointer transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={widget.onClick}
          >
            <h2 className="text-2xl font-semibold text-gray-100">
              {widget.title}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-black bg-opacity-80 text-gray-400 text-center py-6 border-t border-gray-700">
        <p>eshanaha@stevens.edu | github.com/ERShanahan | linkedin.com/in/eshanaha</p>
        <p>© {new Date().getFullYear()} Ethan Shanahan. All rights reserved.</p>
      </footer>
    </div>
  );
}