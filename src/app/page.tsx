"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Prompt } from "@/types/prompt";
import PromptList from "@/components/PromptList";
import PromptForm from "@/components/PromptForm";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { Plus } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch prompts from API
  const fetchPrompts = async () => {
    try {
      const response = await fetch("/api/prompts");
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handlePromptCreated = (newPrompt: Prompt) => {
    setPrompts([newPrompt, ...prompts]);
    setIsFormOpen(false);
  };

  const handlePromptDeleted = (deletedId: string) => {
    setPrompts(prompts.filter((prompt) => prompt.id !== deletedId));
  };

  const handlePromptUpdated = (updatedPrompt: Prompt) => {
    setPrompts(
      prompts.map((prompt) =>
        prompt.id === updatedPrompt.id ? updatedPrompt : prompt
      )
    );
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Prompt Manager
          </h1>
          <p className="text-muted-foreground">
            Please sign in to manage your prompts
          </p>
          <UserNav />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Prompt Manager
              </h1>
              <p className="text-sm text-muted-foreground">
                Organize and manage your AI prompts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <UserNav />
              <ThemeToggle />
              <Button
                onClick={() => setIsFormOpen(true)}
                className="gap-2"
                size="default"
              >
                <Plus className="h-4 w-4" />
                New Prompt
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              Loading your prompts...
            </p>
          </div>
        ) : (
          <PromptList
            prompts={prompts}
            onDelete={handlePromptDeleted}
            onUpdate={handlePromptUpdated}
          />
        )}
      </main>

      {/* Modal for adding new prompt */}
      <PromptForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handlePromptCreated}
      />
    </div>
  );
}
