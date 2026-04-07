"use client";

import * as React from "react";
import { Shield, Brain, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/components/demo/demo-provider";

const SLIDES = [
  {
    icon: Sparkles,
    title: "Meet Claude Agents",
    body: "AI assistants that learn your preferences, understand your context, and earn your trust over time. They start with minimal access and grow more capable as you interact.",
    visual: "agents",
  },
  {
    icon: Shield,
    title: "The Trust Model",
    body: "Every agent follows the same progression — from read-only observer to trusted delegate. You're always in control of what each agent can see and do.",
    visual: "trust",
  },
  {
    icon: Brain,
    title: "Shared Memory",
    body: "What one agent learns helps all the others. Your calendar agent knows about your fitness goals. Your meal planner knows your schedule. They work together through a unified memory system.",
    visual: "memory",
  },
];

const TRUST_STAGES = [
  { stage: 0, label: "New", desc: "No access yet" },
  { stage: 1, label: "Observer", desc: "Read-only access" },
  { stage: 2, label: "Advisor", desc: "Can suggest actions" },
  { stage: 3, label: "Analyst", desc: "Proactive insights" },
  { stage: 4, label: "Partner", desc: "Can act with approval" },
  { stage: 5, label: "Delegate", desc: "Autonomous within bounds" },
];

function TrustModelVisual() {
  return (
    <div className="mt-4 space-y-1.5">
      {TRUST_STAGES.map((s) => (
        <div key={s.stage} className="flex items-center gap-3">
          <div className="flex items-center gap-1 w-32">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i <= s.stage ? "bg-zinc-900" : "bg-zinc-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-zinc-700 w-20">{s.label}</span>
          <span className="text-sm text-zinc-400">{s.desc}</span>
        </div>
      ))}
    </div>
  );
}

function AgentTeamVisual() {
  const agents = [
    { name: "Calendar", emoji: "📅" },
    { name: "Meal Plan", emoji: "🍽️" },
    { name: "Fitness", emoji: "💪" },
    { name: "Finance", emoji: "💰" },
    { name: "Friends", emoji: "👋" },
  ];

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      {agents.map((a) => (
        <div key={a.name} className="flex flex-col items-center gap-1.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-xl">
            {a.emoji}
          </div>
          <span className="text-xs text-zinc-500">{a.name}</span>
        </div>
      ))}
    </div>
  );
}

function MemoryVisual() {
  const memories = [
    "Evenings 5-7:30pm are sacred family time",
    "Prefers meetings clustered, not scattered",
    "Wednesday mornings = deep focus block",
    "Training for a half marathon",
    "Anniversary is Tuesday",
  ];

  return (
    <div className="mt-4 space-y-1.5">
      {memories.map((m) => (
        <div
          key={m}
          className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2"
        >
          <Brain className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
          <span className="text-sm text-zinc-600">{m}</span>
        </div>
      ))}
    </div>
  );
}

export function OnboardingOverlay() {
  const { currentStep, nextStep, prevStep } = useDemo();

  // Only show when the current step has an onboarding slide
  if (!currentStep.onboarding || currentStep.onboardingSlide === undefined) return null;

  const slideIndex = currentStep.onboardingSlide;
  const slide = SLIDES[slideIndex];
  if (!slide) return null;

  const isLast = slideIndex === SLIDES.length - 1;
  const isFirst = slideIndex === 0;
  const SlideIcon = slide.icon;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative z-10 w-[520px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Accent bar */}
        <div className="h-1 bg-zinc-900" />

        <div className="p-8">
          {/* Icon */}
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900/10">
            <SlideIcon className="h-6 w-6 text-zinc-600" />
          </div>

          {/* Content */}
          <h2 className="text-2xl font-semibold text-zinc-900 mb-3">
            {slide.title}
          </h2>
          <p className="text-base leading-relaxed text-zinc-600">
            {slide.body}
          </p>

          {/* Visual */}
          {slide.visual === "trust" && <TrustModelVisual />}
          {slide.visual === "agents" && <AgentTeamVisual />}
          {slide.visual === "memory" && <MemoryVisual />}

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === slideIndex
                      ? "w-6 bg-zinc-900"
                      : "w-2 bg-zinc-300"
                  )}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                {isLast ? "Get Started" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
