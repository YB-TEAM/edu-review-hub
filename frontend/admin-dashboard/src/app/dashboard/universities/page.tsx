"use client";

import { useState, useEffect } from "react";
import { useGetUniversitiesQuery, useUpdateUniversityMutation, useDeleteUniversityMutation } from "@/lib/services/universityApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Globe,
  Phone,
  Mail,
  Star,
  Users,
  GraduationCap,
  TrendingUp,
  Download,
  Upload,
  MoreHorizontal
} from "lucide-react";

interface University {
  id: string;
  name: string;
  code: string;
  type: string;
  address: {
    city: string;
    district: string;
    fullAddress: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  stats: {
    studentCount: number;
    facultyCount: number;
    programCount: number;
    rating: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  logo?: string;
  description?: string;
}

export default function UniversitiesPage() {
  const { data: universities, isLoading, error, refetch } = useGetUniversitiesQuery();
  const [updateUniversity] = useUpdateUniversityMutation();
  const [deleteUniversity] = useDeleteUniversityMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [universitiesPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const filteredUniversities = universities?.filter((university: University) => {
    const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         university.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || university.type === typeFilter;
    const matchesCity = cityFilter === "all" || university.address.city === cityFilter;
    const matchesStatus = statusFilter === "all" || university.status === statusFilter;
    
    return matchesSearch && matchesType && matchesCity && matchesStatus;
  }) || [];

  const indexOfLastUniversity = currentPage * universitiesPerPage;
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
  const currentUniversities = filteredUniversities.slice(indexOfFirstUniversity, indexOfLastUniversity);
  const totalPages = Math.ceil(filteredUniversities.length / universitiesPerPage);

  const handleStatusChange = async (universityId: string, newStatus: string) => {
    try {
      await updateUniversity({ id: universityId, status: newStatus }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update university status:", error);
    }
  };

  const handleDeleteUniversity = async (universityId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa trường đại học này?")) {
      try {
        await deleteUniversity(universityId).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete university:", error);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUniversities.length === 0) return;
    
    try {
      if (action === "activate") {
        await Promise.all(selectedUniversities.map(id => updateUniversity({ id, status: "active" })));
      } else if (action === "deactivate") {
        await Promise.all(selectedUniversities.map(id => updateUniversity({ id, status: "inactive" })));
      } else if (action === "delete") {
        if (confirm(`Bạn có chắc chắn muốn xóa ${selectedUniversities.length} trường đại học?`)) {
          await Promise.all(selectedUniversities.map(id => deleteUniversity(id)));
        }
      }
      setSelectedUniversities([]);
      refetch();
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Hoạt động</Badge>;
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>;
      case "pending":
        return <Badge variant="warning">Chờ duyệt</Badge>;
      case "suspended":
        return <Badge variant="destructive">Bị đình chỉ</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "public":
        return <Badge variant="info">Công lập</Badge>;
      case "private":
        return <Badge variant="warning">Tư thục</Badge>;
      case "international":
        return <Badge variant="default">Quốc tế</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Đang tải danh sách trường đại học...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="text-lg text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
          <Button onClick={() => refetch()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý trường đại học</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin các trường đại học trong hệ thống</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm trường mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng trường</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filteredUniversities.length}</div>
            <p className="text-xs text-muted-foreground">Tất cả trường đại học</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Công lập</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredUniversities.filter(u => u.type === "public").length}
            </div>
            <p className="text-xs text-muted-foreground">Trường công lập</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tư thục</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredUniversities.filter(u => u.type === "private").length}
            </div>
            <p className="text-xs text-muted-foreground">Trường tư thục</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sinh viên</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredUniversities.reduce((sum, uni) => sum + uni.stats.studentCount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Sinh viên toàn hệ thống</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm trường..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại hình</option>
              <option value="public">Công lập</option>
              <option value="private">Tư thục</option>
              <option value="international">Quốc tế</option>
            </select>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả thành phố</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Cần Thơ">Cần Thơ</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="pending">Chờ duyệt</option>
              <option value="suspended">Bị đình chỉ</option>
            </select>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                Bảng
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                Lưới
              </Button>
            </div>
            <Button variant="outline" className="flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUniversities.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedUniversities.length} trường được chọn
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("activate")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Kích hoạt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("deactivate")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Vô hiệu hóa
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Universities Display */}
      {viewMode === "table" ? (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách trường đại học</CardTitle>
            <CardDescription>
              Tổng cộng {filteredUniversities.length} trường
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUniversities(currentUniversities.map(u => u.id));
                          } else {
                            setSelectedUniversities([]);
                          }
                        }}
                        checked={selectedUniversities.length === currentUniversities.length && currentUniversities.length > 0}
                      />
                    </th>
                    <th className="text-left p-3 font-medium">Trường</th>
                    <th className="text-left p-3 font-medium">Loại hình</th>
                    <th className="text-left p-3 font-medium">Địa chỉ</th>
                    <th className="text-left p-3 font-medium">Thống kê</th>
                    <th className="text-left p-3 font-medium">Trạng thái</th>
                    <th className="text-left p-3 font-medium">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUniversities.map((university) => (
                    <tr key={university.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedUniversities.includes(university.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUniversities([...selectedUniversities, university.id]);
                            } else {
                              setSelectedUniversities(selectedUniversities.filter(id => id !== university.id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                            {university.logo ? (
                              <img src={university.logo} alt={university.name} className="w-12 h-12 object-cover" />
                            ) : (
                              <Building2 className="h-6 w-6 text-gray-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{university.name}</div>
                            <div className="text-sm text-gray-500">Mã: {university.code}</div>
                            {university.description && (
                              <div className="text-xs text-gray-400 truncate max-w-xs">
                                {university.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        {getTypeBadge(university.type)}
                      </td>
                      <td className="p-3">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span>{university.address.city}</span>
                          </div>
                          <div className="text-xs text-gray-500">{university.address.district}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span>{university.stats.studentCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="h-3 w-3 text-gray-500" />
                            <span>{university.stats.programCount}</span>
                          </div>
                          <div>{getRatingStars(university.stats.rating)}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={university.status}
                          onChange={(e) => handleStatusChange(university.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="active">Hoạt động</option>
                          <option value="inactive">Không hoạt động</option>
                          <option value="pending">Chờ duyệt</option>
                          <option value="suspended">Bị đình chỉ</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteUniversity(university.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
                <div className="text-sm text-gray-600">
                  Hiển thị {indexOfFirstUniversity + 1}-{Math.min(indexOfLastUniversity, filteredUniversities.length)} trong tổng số {filteredUniversities.length} trường
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUniversities.map((university) => (
            <Card key={university.id} className="hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {university.logo ? (
                  <img src={university.logo} alt={university.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {getStatusBadge(university.status)}
                  <input
                    type="checkbox"
                    checked={selectedUniversities.includes(university.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUniversities([...selectedUniversities, university.id]);
                      } else {
                        setSelectedUniversities(selectedUniversities.filter(id => id !== university.id));
                      }
                    }}
                  />
                </div>
                <CardTitle className="text-lg line-clamp-2">{university.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  Mã: {university.code} • {university.address.city}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2 mb-3">
                  {getTypeBadge(university.type)}
                  {getRatingStars(university.stats.rating)}
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{university.address.district}, {university.address.city}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{university.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span>{university.contact.email}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">{university.stats.studentCount.toLocaleString()}</div>
                    <div className="text-gray-500">Sinh viên</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">{university.stats.facultyCount}</div>
                    <div className="text-gray-500">Khoa</div>
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-900">{university.stats.programCount}</div>
                    <div className="text-gray-500">Chương trình</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteUniversity(university.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
