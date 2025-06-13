"use client";

import { useState } from "react";
import { Prompt } from "@/types/prompt";
import PromptCard from "./PromptCard";
import PromptForm from "./PromptForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText, Plus } from "lucide-react";

interface PromptListProps {
  prompts: Prompt[];
  onDelete: (id: string) => void;
  onUpdate: (prompt: Prompt) => void;
}

export default function PromptList({
  prompts,
  onDelete,
  onUpdate,
}: PromptListProps) {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Filter prompts based on search term and category
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      !selectedCategory || prompt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(prompts.map((p) => p.category).filter(Boolean))
  );

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
  };

  const handleUpdate = (updatedPrompt: Prompt) => {
    onUpdate(updatedPrompt);
    setEditingPrompt(null);
  };

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">No prompts yet</h3>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Create your first AI prompt to get started organizing your creative
          workflow.
        </p>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create your first prompt
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts, tags, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {categories.length > 0 && (
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? "" : value || "")
            }
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category!} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{filteredPrompts.length}</span>
          <span className="text-muted-foreground">
            {filteredPrompts.length === 1 ? "prompt" : "prompts"}
          </span>
          {searchTerm && (
            <span className="text-muted-foreground">
              matching{" "}
              <span className="font-medium text-foreground">
                &ldquo;{searchTerm}&rdquo;
              </span>
            </span>
          )}
        </div>
        {selectedCategory && (
          <Badge variant="secondary">Category: {selectedCategory}</Badge>
        )}
      </div>

      {/* Results Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No prompts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <PromptForm
        prompt={editingPrompt || undefined}
        open={!!editingPrompt}
        onOpenChange={(open) => !open && setEditingPrompt(null)}
        onSubmit={handleUpdate}
        isEditing={!!editingPrompt}
      />
    </div>
  );
}
