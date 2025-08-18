"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // hoặc style khác

interface Props {
  content: string;
}

export const MarkdownRenderer = ({ content }: Props) => {
  return (
    <article
      className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 
                 dark:prose-headings:text-white prose-a:text-blue-600 dark:prose-a:text-blue-400 
                 prose-strong:text-gray-900 dark:prose-strong:text-white prose-blockquote:border-l-blue-600 
                 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 
                 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 
                 prose-img:rounded-xl prose-img:shadow-md mb-10"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        children={content}
      />
    </article>
  );
};
