"use client";

import { useState } from "react";
import { Prompt } from "@/types/prompt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export default function PromptCard({
  prompt,
  onEdit,
  onDelete,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      onDelete(prompt.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  return (
    <Card className="group h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {prompt.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(prompt)}
              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {prompt.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {prompt.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <pre className="whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed">
            {showFullContent ? prompt.content : truncateContent(prompt.content)}
          </pre>
        </div>

        {prompt.content.length > 150 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullContent(!showFullContent)}
            className="mt-2 h-auto p-0 text-primary hover:text-primary/80"
          >
            {showFullContent ? (
              <>
                Show less <ChevronUp className="ml-1 h-3 w-3" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="ml-1 h-3 w-3" />
              </>
            )}
          </Button>
        )}

        {prompt.tags.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-1">
              {prompt.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full items-center justify-between">
          <div>
            {prompt.category && (
              <Badge variant="outline" className="text-xs">
                {prompt.category}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(prompt.createdAt)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
