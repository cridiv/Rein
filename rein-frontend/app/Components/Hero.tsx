"use client";

import React from "react";
import CardSwap, { Card } from "../animations/CardSwap";
import { Target, Brain, Calendar, Trophy, Zap } from "lucide-react";
import Grainient from "../animations/Grainient";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 lg:pt-40 md:px-12 lg:px-24 pt-24 overflow-hidden">
      {/* Grainient Background */}
      <div className="absolute inset-0 -z-10">
        <Grainient
          color1="#0a0a0a"
          color2="#52cbff"
          color3="#0a0a0a"
          timeSpeed={0}
          colorBalance={0}
          warpStrength={0.8}
          warpFrequency={4}
          warpSpeed={1.5}
          warpAmplitude={40}
          blendAngle={0}
          blendSoftness={0.1}
          rotationAmount={400}
          noiseScale={2.57}
          grainAmount={0.18}
          grainScale={2}
          grainAnimated={false}
          contrast={1.3}
          gamma={1}
          saturation={0.9}
          centerX={0}
          centerY={0}
          zoom={1}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Text Section */}
        <section className="pt-1 pb-10 lg:pb-20 px-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Badge
              variant="outline"
              className="border-primary/50 text-primary text-[10px] uppercase tracking-widest"
            >
              v1.0 Agent Active
            </Badge>
            <span className="text-xs font-medium text-primary/80">
              Rein is now in open beta
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6">
            EXECUTE <br />
            GOALS WITH&nbsp;
            <span className="text-primary italic">REIN.</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl font-medium text-muted-foreground mb-8 lg:mb-10">
            Turn vague goals into real-world commits, events, and streaks. Rein
            is the bridge between your intentions and your tools.
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/signin">
              <button className="bg-primary cursor-pointer text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </Link>
            <Link href="/#features">
              <button className="border border-border cursor-pointer px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium hover:bg-muted transition-colors">
                Learn More
              </button>
            </Link>
          </div>
        </section>

        {/* Illustration Section - Hidden on smaller devices */}
        <div className="hidden lg:pr-12 lg:pt-12 lg:flex relative items-center justify-center min-h-[450px] md:min-h-[500px] lg:min-h-[550px]">
          <div className="relative w-full h-full">
            <CardSwap
              width={380}
              height={280}
              cardDistance={55}
              verticalDistance={55}
              delay={4000}
              pauseOnHover={true}
              skewAmount={4}
              easing="elastic"
            >
              {/* Card 1 - Goal Setting */}
              <Card className="!bg-background !border-border brutal-card p-0 overflow-hidden flex flex-col shadow-xl">
                {/* Card Image/Visual */}
                <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-2">
                      <div className="w-16 h-20 bg-background/80 rounded-lg border border-border p-2 flex flex-col gap-1 shadow-sm">
                        <div className="w-full h-2 bg-primary/40 rounded-full"></div>
                        <div className="w-3/4 h-2 bg-muted rounded-full"></div>
                        <div className="flex-1 flex items-end">
                          <Target className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div className="w-16 h-20 bg-background/80 rounded-lg border border-primary/50 p-2 flex flex-col gap-1 shadow-sm scale-110 -translate-y-1">
                        <div className="w-full h-2 bg-primary rounded-full"></div>
                        <div className="w-1/2 h-2 bg-muted rounded-full"></div>
                        <div className="flex-1 flex items-end justify-between">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-[8px] text-primary font-bold">
                            NEW
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-20 bg-background/80 rounded-lg border border-border p-2 flex flex-col gap-1 shadow-sm">
                        <div className="w-full h-2 bg-muted rounded-full"></div>
                        <div className="w-2/3 h-2 bg-muted rounded-full"></div>
                        <div className="flex-1 flex items-end">
                          <Trophy className="w-4 h-4 text-amber-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card Content */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      Define Your Resolutions
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Transform vague intentions into clear, actionable goals.
                    Rein breaks down your ambitions into daily wins.
                  </p>
                </div>
              </Card>

              {/* Card 2 - AI Chat Interface */}
              <Card className="!bg-background !border-border brutal-card p-0 overflow-hidden flex flex-col shadow-xl">
                {/* Card Image/Visual - Chat mockup */}
                <div className="relative h-32 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent overflow-hidden p-3">
                  <div className="flex flex-col gap-2 h-full">
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-white font-bold">
                          R
                        </span>
                      </div>
                      <div className="bg-background/90 rounded-lg rounded-tl-none px-3 py-2 border border-border max-w-[80%]">
                        <p className="text-[10px] text-foreground">
                          Ready to crush your goals today? 🎯
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start justify-end">
                      <div className="bg-primary/20 rounded-lg rounded-tr-none px-3 py-2 border border-primary/30 max-w-[70%]">
                        <p className="text-[10px] text-foreground">
                          Yes! What&apos;s my focus?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-background/90 rounded-lg rounded-tl-none px-3 py-2 border border-border">
                        <p className="text-[10px] text-foreground">
                          Complete 30 min workout 💪
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card Content */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-blue-500" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      AI-Powered Coaching
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get personalized nudges, reminders, and motivation exactly
                    when you need them most.
                  </p>
                </div>
              </Card>

              {/* Card 3 - Progress Dashboard */}
              <Card className="!bg-background !border-border brutal-card p-0 overflow-hidden flex flex-col shadow-xl">
                {/* Card Image/Visual - Dashboard mockup */}
                <div className="relative h-32 bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent overflow-hidden p-3">
                  <div className="flex gap-3 h-full items-center justify-center">
                    {/* Mini chart */}
                    <div className="flex items-end gap-1 h-16">
                      <div
                        className="w-3 bg-muted/50 rounded-t"
                        style={{ height: "30%" }}
                      ></div>
                      <div
                        className="w-3 bg-muted/50 rounded-t"
                        style={{ height: "50%" }}
                      ></div>
                      <div
                        className="w-3 bg-emerald-500/60 rounded-t"
                        style={{ height: "70%" }}
                      ></div>
                      <div
                        className="w-3 bg-emerald-500/80 rounded-t"
                        style={{ height: "85%" }}
                      ></div>
                      <div
                        className="w-3 bg-emerald-500 rounded-t"
                        style={{ height: "100%" }}
                      ></div>
                    </div>
                    {/* Stats */}
                    <div className="flex flex-col gap-2">
                      <div className="bg-background/90 rounded-lg px-3 py-2 border border-border">
                        <p className="text-[10px] text-muted-foreground">
                          Current Streak
                        </p>
                        <p className="text-lg font-black text-emerald-500">
                          14 🔥
                        </p>
                      </div>
                      <div className="bg-background/90 rounded-lg px-3 py-1.5 border border-emerald-500/50">
                        <p className="text-[10px] text-emerald-500 font-semibold">
                          +23% this week
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card Content */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      Track Your Progress
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Visualize streaks, celebrate milestones, and watch your
                    consistency compound over time.
                  </p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
