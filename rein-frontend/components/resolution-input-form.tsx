"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResolutionFormData {
  title: string;
  description: string;
  deadline: string;
  priority: "low" | "medium" | "high";
}

interface ResolutionInputFormProps {
  onSubmit?: (data: ResolutionFormData) => Promise<void>;
}

export function ResolutionInputForm({ onSubmit }: ResolutionInputFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ResolutionFormData>({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default: send to NestJS backend
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
          }/resolutions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create resolution");
        }

        // Reset form on success
        setFormData({
          title: "",
          description: "",
          deadline: "",
          priority: "medium",
        });
      }
    } catch (error) {
      console.error("Error submitting resolution:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="brutal-card w-full max-w-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-primary">
          New Resolution
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Define your goal and let Rein&apos;s AI agent execute it for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Resolution Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Learn TypeScript, Ship my SaaS, Read 24 books..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="brutal-input h-12 text-base"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Break it down{" "}
              <span className="text-muted-foreground font-normal">
                (AI will help refine this)
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your resolution in detail. What does success look like? What milestones do you want to hit?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="brutal-input resize-none text-base"
            />
          </div>

          {/* Deadline & Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-semibold">
                Target Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="brutal-input h-12"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Priority Level</Label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, priority: level })
                    }
                    className={`
                      flex-1 py-2 px-3 rounded-md font-medium text-sm capitalize
                      transition-all duration-150 border-2
                      ${
                        formData.priority === level
                          ? level === "high"
                            ? "bg-red-500/20 border-red-500 text-red-400"
                            : level === "medium"
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-green-500/20 border-green-500 text-green-400"
                          : "bg-muted border-border text-muted-foreground hover:border-primary/50"
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button - Neo-Brutalist style */}
          <Button
            type="submit"
            disabled={isLoading || !formData.title}
            className="brutal-button w-full h-12 text-base font-bold rounded-md"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Resolution with AI
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
