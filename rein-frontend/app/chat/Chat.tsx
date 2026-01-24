"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Loader2, Play, Terminal } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const mode = searchParams.get("mode");

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // This state represents the "Work in Progress" for Opik evaluations
  const [auditStats, setAuditStats] = useState({
    clarityScore: 0,
    actionability: 0,
    platformReady: false,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Initial Analysis on Load
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      handleInitialAnalysis(initialPrompt);
    }
  }, [initialPrompt]);

  const handleInitialAnalysis = async (prompt: string) => {
    setIsProcessing(true);
    // TODO: Connect to NestJS Agent: /api/agents/analyze
    setMessages([{ role: "user", content: prompt }]);

    // Simulate Agent Reasoning
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've analyzed your goal. It's a great start! To make this executable, I've drafted some SMART goals. Does this timeline work for you, or should we adjust the intensity?`,
        },
      ]);
      setAuditStats({ clarityScore: 7, actionability: 4, platformReady: true });
      setIsProcessing(false);
    }, 1500);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newMsg: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newMsg]);
    setUserInput("");
    setIsProcessing(true);

    // TODO: API Call to NestJS Chat Agent
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Understood. I've updated the plan constraints.",
        },
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-background pt-16">
      {/* LEFT: Chat Area */}
      <div className="flex-1 flex flex-col border-r border-border">
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary border border-border"
                  }`}
                >
                  <p className="text-sm">{m.content}</p>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start gap-2 items-center text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs italic">Rein is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Dock */}
        <div className="p-6 border-t border-border bg-card/50">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask Rein to adjust the plan..."
              className="flex-1 bg-background border-2 border-border rounded-xl px-4 py-2 focus:outline-none focus:border-primary transition-all"
            />
            <Button onClick={handleSendMessage} disabled={isProcessing}>
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* RIGHT: Rein Intelligence Sidebar (The Opik Hook) */}
      <div className="w-80 bg-secondary/30 p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Terminal className="w-3 h-3" /> Rein Audit Trace
          </h2>
          <Card className="p-4 bg-black text-green-500 font-mono text-[10px] space-y-1">
            <p>&gt; OPIK_TRACE_ID: {Math.random().toString(36).substring(7)}</p>
            <p>&gt; CLARITY_SCORE: {auditStats.clarityScore}/10</p>
            <p>&gt; ACTIONABILITY: {auditStats.actionability}/10</p>
            <p>
              &gt; STATUS: {isProcessing ? "ANALYZING" : "AWAITING_CONFIRM"}
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold">Draft SMART Goals</h2>
          {/* Example Goal Card */}
          <div className="p-3 bg-card border border-border rounded-lg shadow-sm space-y-2">
            <Badge variant="outline" className="text-[10px]">
              GitHub + Calendar
            </Badge>
            <p className="text-xs font-medium">Build MVP core architecture</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 text-primary" /> Measurable: 5
              modules
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <Button
            className="w-full py-6 text-lg font-black uppercase group"
            disabled={!auditStats.platformReady}
          >
            Implement Plan
            <Play className="ml-2 w-4 h-4 group-hover:fill-current" />
          </Button>
          <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
            Ready to route to Google Calendar & GitHub
          </p>
        </div>
      </div>
    </div>
  );
}
