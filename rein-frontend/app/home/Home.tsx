import React from "react";
import Navbar from "./components/Navbar";
import PromptInput from "./components/PromptInput";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-24 sm:pt-32 md:pt-48 w-full px-4">
        {/* Background glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] opacity-30"></div>
        </div>

        <div className="relative z-10 flex flex-col gap-4 items-center mb-8">
          {/* Main Heading */}
          <h1 className="flex flex-wrap items-center gap-2 sm:gap-3 text-foreground justify-center font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-center">
            What will you
            <span className="sr-only"> build </span>
            {/* "build" SVG Logo - Rein branded */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="135"
              height="47"
              fill="none"
              aria-hidden="true"
              className="scale-75 sm:scale-90 md:scale-100"
            >
              <defs>
                <linearGradient
                  id="rein-gradient"
                  x1="76.5"
                  x2="75.895"
                  y1="55"
                  y2="-8.494"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#52cbff"></stop>
                  <stop offset="1" stopColor="#ededed"></stop>
                </linearGradient>
              </defs>
              <path
                fill="url(#rein-gradient)"
                fillRule="evenodd"
                d="M20.176 41.612c-3.145 0-6.233-1.135-8.006-3.575l-.626 2.878L0 47l1.246-6.085 8.408-37.83h10.293l-2.973 13.334c2.401-2.61 4.632-3.575 7.491-3.575 6.176 0 10.294 4.029 10.294 11.405 0 7.604-4.747 17.363-14.583 17.363Zm3.946-15.207c0 3.518-2.516 6.185-5.776 6.185-1.83 0-3.488-.68-4.575-1.872l1.601-6.98c1.201-1.191 2.574-1.872 4.175-1.872 2.459 0 4.575 1.816 4.575 4.54Z"
                clipRule="evenodd"
              ></path>
              <path
                fill="url(#rein-gradient)"
                d="M40.855 13.708h10.493l-3.44 15.443c-.116.52-.174.926-.174 1.33 0 1.91 1.69 2.661 3.556 2.661 2.098 0 3.672-1.214 4.78-2.198l3.847-17.236H70.41l-6.237 27.937H53.68l.758-3.181c-2.04 1.85-4.606 3.875-8.861 3.875-5.888 0-9.269-3.181-9.269-7.346 0-.463.175-1.735.291-2.256l4.256-19.029Z"
              ></path>
              <path
                fill="url(#rein-gradient)"
                d="M80.813 11.684c-3.09 0-5.305-2.256-5.305-4.975C75.508 2.371 79.18 0 82.153 0c3.09 0 5.305 2.256 5.305 4.974 0 4.338-3.672 6.71-6.645 6.71Zm-2.04 29.96H68.278l6.238-27.936H85.01l-6.238 27.937Z"
              ></path>
              <path
                fill="url(#rein-gradient)"
                d="M93.362 41.645H82.869l8.57-38.58h10.492l-8.57 38.58Z"
              ></path>
              <path
                fill="url(#rein-gradient)"
                d="M113.314 13.014c3.207 0 6.355 1.157 8.162 3.644l3.031-13.592H135l-8.628 38.579h-10.493l.7-2.95c-2.448 2.66-4.722 3.644-7.637 3.644-6.295 0-10.493-4.107-10.493-11.626 0-7.75 4.839-17.699 14.865-17.699Zm1.866 9.197c-3.323 0-5.888 2.718-5.888 6.304 0 2.776 2.157 4.627 4.664 4.627 1.632 0 3.031-.694 4.255-1.909l1.632-7.114c-1.107-1.214-2.798-1.909-4.663-1.909Z"
              ></path>
            </svg>
            today?
          </h1>

          {/* Subtitle */}
          <p className="font-medium text-base sm:text-lg text-muted-foreground text-center max-w-[90vw] md:max-w-xl">
            Turn your goals into real-world execution with AI-powered planning.
          </p>

          {/* Prompt Input */}
          <div className="w-full mt-6 sm:mt-10">
            <PromptInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
