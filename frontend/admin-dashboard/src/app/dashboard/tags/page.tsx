"use client";

import { useState, useEffect } from "react";
import { useGetAllTagsQuery as useGetTagsQuery, useCreateTagMutation, useUpdateTagMutation, useDeleteTagMutation } from "@/lib/services/tagApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tags, Search, Filter, Plus, Edit, Trash2, Eye, Hash, TrendingUp, BookOpen } from "lucide-react";
import { Tag as TagType } from "@/types/tag";

export default function TagsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);

  const { data: tagsResponse, isLoading, error, refetch } = useGetTagsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
  });

  const [createTag] = useCreateTagMutation();
  const [updateTag] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTag(formData).unwrap();
      setShowCreateForm(false);
      setFormData({
        name: "",
        description: "",
        color: "#3B82F6",
      });
      refetch();
    } catch (err) {
      console.error("Failed to create tag:", err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;
    
    try {
      await updateTag({
        id: editingTag.id,
        ...formData,
      }).unwrap();
      setEditingTag(null);
      setFormData({
        name: "",
        description: "",
        color: "#3B82F6",
      });
      refetch();
    } catch (err) {
      console.error("Failed to update tag:", err);
    }
  };

  const handleDelete = async (tagId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa tag này?")) {
      try {
        await deleteTag(tagId).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete tag:", err);
      }
    }
  };

  const handleEdit = (tag: TagType) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || "",
      color: tag.color || "#3B82F6",
    });
  };

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingTag(null);
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
    });
  };

  const filteredTags = tagsResponse?.data || [];
  const totalTags = tagsResponse?.metadata?.total || 0;
  const totalPages = Math.ceil(totalTags / itemsPerPage);

  // Calculate usage statistics
  const totalUsage = filteredTags.reduce((sum, tag) => sum + (tag.usageCount || 0), 0);
  const mostUsedTag = filteredTags.reduce((max, tag) => 
    (tag.usageCount || 0) > (max?.usageCount || 0) ? tag : max, null as TagType | null
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải danh sách tags...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            Có lỗi xảy ra khi tải danh sách tags. Vui lòng thử lại.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tags</h1>
          <p className="text-gray-600">Quản lý các tag và nhãn trong hệ thống</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm tag mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tags</CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTags}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sử dụng</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tag phổ biến</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600">
              {mostUsedTag?.name || "N/A"}
            </div>
            <div className="text-xs text-gray-500">
              {mostUsedTag?.usageCount || 0} lần sử dụng
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trung bình</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalTags > 0 ? Math.round(totalUsage / totalTags) : 0}
            </div>
            <div className="text-xs text-gray-500">lần/tag</div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingTag) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTag ? "Chỉnh sửa tag" : "Thêm tag mới"}
            </CardTitle>
            <CardDescription>
              {editingTag ? "Cập nhật thông tin tag" : "Nhập thông tin tag mới"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingTag ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên tag *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tên tag"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Màu sắc</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả về tag"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingTag ? "Cập nhật" : "Tạo mới"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc và tìm kiếm</CardTitle>
          <CardDescription>Tìm kiếm và lọc tags theo tiêu chí</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Tìm theo tên, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                <Filter className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tags</CardTitle>
          <CardDescription>
            Hiển thị {filteredTags.length} trong tổng số {totalTags} tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Tag</th>
                  <th className="text-left py-3 px-4 font-medium">Mô tả</th>
                  <th className="text-left py-3 px-4 font-medium">Sử dụng</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày tạo</th>
                  <th className="text-left py-3 px-4 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag) => (
                  <tr key={tag.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: tag.color || "#3B82F6" }}
                        >
                          <Tags className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{tag.name}</div>
                          <div className="text-sm text-gray-500">#{tag.name.toLowerCase().replace(/\s+/g, '-')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {tag.description || "Không có mô tả"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-sm font-medium">{tag.usageCount || 0}</div>
                        <div className="text-xs text-gray-500">lần sử dụng</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(tag.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(tag)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleDelete(tag.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, totalTags)} trong tổng số {totalTags} kết quả
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                <span className="px-3 py-2 text-sm">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
