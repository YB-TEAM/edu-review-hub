"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/features/landing/components/navbar/Navbar";
import { Footer } from "@/features/landing/components/footer/Footer";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Import markdown editor dynamically
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md" />
});

export default function DemoPage() {
  const [content, setContent] = useState(`# Chào mừng đến với Markdown Editor!

## Tính năng hỗ trợ:

### 1. **In đậm** và *in nghiêng*
- Danh sách không đánh số
- Một mục khác

### 2. Danh sách đánh số:
1. Mục đầu tiên
2. Mục thứ hai
3. Mục thứ ba

### 3. Chèn ảnh:
![Mô tả ảnh](https://via.placeholder.com/300x200)

### 4. Chèn link:
[Link đến Google](https://google.com)

### 5. Code:
\`\`\`javascript
console.log("Hello World!");
\`\`\`

### 6. Quote:
> Đây là một đoạn quote

---

**Bạn có thể chỉnh sửa nội dung này để test!**`);

  const handleTest = () => {
    toast.success("Markdown editor hoạt động tốt!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-slate-900">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 pt-20 md:pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Demo Markdown Editor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test markdown editor với đầy đủ tính năng
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Markdown Editor Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <div data-color-mode="dark">
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || "")}
                height={400}
                preview="edit"
              />
            </div>
            
            <div className="mt-4">
              <Button onClick={handleTest}>
                Test Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
} 