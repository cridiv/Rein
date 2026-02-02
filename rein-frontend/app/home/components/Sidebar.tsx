"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { resolutionAPI, Resolution } from "@/lib/resolutions";
import {
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  Plus,
  Clock,
  Target,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Clean title helper function - extracts first bullet point (matches backend logic)
  const cleanTitle = (rawTitle: string): string => {
    let cleaned = rawTitle;

    // Remove "Here's what I understood:" and similar intro phrases
    cleaned = cleaned.replace(/^.*?(?:Here's what I understood|Here is what I understood|Understanding)[:\s]*\n*/i, '');
    
    // Extract content after first bullet point (handles both **text** and plain text)
    const firstBulletMatch = cleaned.match(/^[•\-*]\s*(.+?)(?:\n|$)/m);
    if (firstBulletMatch) {
      cleaned = firstBulletMatch[1].trim();
    } else {
      // If no bullet, try to get first line
      const lines = cleaned.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        cleaned = lines[0];
      }
    }
    
    // Remove all markdown formatting
    cleaned = cleaned
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/^[•\-*]\s+/gm, '') // Remove any remaining bullet points
      .trim();

    // Get just the first sentence if it's too long
    if (cleaned.length > 200) {
      const sentences = cleaned.split(/[.!?]\s+/);
      cleaned = sentences[0] + (cleaned.endsWith('.') ? '' : '.');
    }

    return cleaned;
  };

  // Fetch user's resolutions
  useEffect(() => {
    const fetchResolutions = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Fetch real resolutions from API
          const userResolutions = await resolutionAPI.getAllByUser(user.id);
          setResolutions(userResolutions);
        }
      } catch (error) {
        console.error("Failed to fetch resolutions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResolutions();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "paused":
        return "bg-yellow-500";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <>
      {/* Overlay backdrop when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-card border-r border-border z-50 transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "w-72" : "w-0 lg:w-16"
        } overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {isOpen && (
            <Link href="/home" className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">My Goals</span>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isOpen ? (
              <PanelLeftClose className="w-5 h-5 text-muted-foreground" />
            ) : (
              <PanelLeft className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Dashboards List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {isOpen && (
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recent
              </span>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
          ) : resolutions.length === 0 ? (
            <div className="px-3 py-8 text-center">
              {isOpen && (
                <>
                  <Target className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No goals yet. Create your first one!
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {resolutions.map((resolution) => {
                const isActive = pathname === `/dashboard/${resolution.id}`;
                return (
                  <Link
                    key={resolution.id}
                    href={`/dashboard/${resolution.id}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                      isActive
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-secondary border border-transparent"
                    } ${!isOpen && "justify-center"}`}
                    title={resolution.title}
                  >
                    {/* Status indicator */}
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(
                        resolution.status,
                      )}`}
                    />

                    {isOpen && (
                      <>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isActive
                                ? "text-primary"
                                : "text-foreground group-hover:text-foreground"
                            }`}
                          >
                            {cleanTitle(resolution.title)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(resolution.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ${
                            isActive && "opacity-100 text-primary"
                          }`}
                        />
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        {isOpen && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>
                {resolutions.filter((r) => r.status === "pending" || r.status === "active").length} active
                goals
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Toggle button when sidebar is collapsed (visible on larger screens) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-20 left-4 z-30 p-2 bg-card border border-border rounded-lg shadow-lg hover:bg-secondary transition-colors cursor-pointer lg:hidden"
          aria-label="Open sidebar"
        >
          <PanelLeft className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
