# Toast và API Helper Usage Guide

## Cài đặt

Hệ thống toast đã được cài đặt với `sonner` và tích hợp sẵn vào admin dashboard.

## Sử dụng Toast cơ bản

### 1. Sử dụng hook `useToast`

```tsx
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Thao tác thành công!');
  };

  const handleError = () => {
    toast.error('Đã xảy ra lỗi!');
  };

  const handleWarning = () => {
    toast.warning('Cảnh báo!');
  };

  const handleInfo = () => {
    toast.info('Thông tin!');
  };

  const handleLoading = () => {
    const loadingToast = toast.loading('Đang xử lý...');
    // Dismiss loading toast
    toast.dismiss(loadingToast);
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleWarning}>Warning</button>
      <button onClick={handleInfo}>Info</button>
      <button onClick={handleLoading}>Loading</button>
    </div>
  );
}
```

### 2. Sử dụng trực tiếp `toast` từ sonner

```tsx
import { toast } from 'sonner';

// Success toast
toast.success('Thao tác thành công!');

// Error toast
toast.error('Đã xảy ra lỗi!');

// Warning toast
toast.warning('Cảnh báo!');

// Info toast
toast.info('Thông tin!');

// Loading toast
const loadingToast = toast.loading('Đang xử lý...');
// Dismiss when done
toast.dismiss(loadingToast);

// Promise toast
toast.promise(
  fetchData(),
  {
    loading: 'Đang tải dữ liệu...',
    success: 'Tải dữ liệu thành công!',
    error: 'Lỗi khi tải dữ liệu!',
  }
);
```

## Sử dụng API Helper với RTK Query

### 1. Xử lý Mutations

```tsx
import { ApiHelper } from '@/lib/services/apiHelper';
import { useUpdateUserMutation } from '@/lib/services/userApi';

function UserEditForm({ user }) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleSubmit = async (formData) => {
    try {
      const result = await updateUser(formData).unwrap();
      
      // Sử dụng ApiHelper để xử lý kết quả
      const { success, data, error } = ApiHelper.handleMutationResult(
        { data: result },
        'Cập nhật',
        'người dùng'
      );

      if (success) {
        // Xử lý thành công
        console.log('User updated:', data);
      }
    } catch (error) {
      // Lỗi đã được xử lý tự động bởi ApiHelper
      console.error('Update failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
      </button>
    </form>
  );
}
```

### 2. Xử lý Queries

```tsx
import { ApiHelper } from '@/lib/services/apiHelper';
import { useGetUsersQuery } from '@/lib/services/userApi';

function UserList() {
  const { data, error, isLoading } = useGetUsersQuery();

  // Sử dụng ApiHelper để xử lý kết quả query
  const { success, data: users, error: queryError } = ApiHelper.handleQueryResult(
    { data, error },
    true // showError = true
  );

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (!success) {
    return <div>Lỗi khi tải danh sách người dùng</div>;
  }

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 3. Sử dụng ApiHelper.handleRequest

```tsx
import { ApiHelper } from '@/lib/services/apiHelper';

function MyComponent() {
  const handleCustomOperation = async () => {
    const result = await ApiHelper.handleRequest(
      async () => {
        // Custom async operation
        const response = await fetch('/api/custom-endpoint');
        return response.json();
      },
      {
        loadingMessage: 'Đang xử lý yêu cầu...',
        successMessage: 'Yêu cầu được xử lý thành công!',
        errorMessage: 'Lỗi khi xử lý yêu cầu',
        showLoading: true,
        showSuccess: true,
        showError: true,
      }
    );

    if (result.success) {
      console.log('Operation successful:', result.data);
    } else {
      console.error('Operation failed:', result.error);
    }
  };

  return (
    <button onClick={handleCustomOperation}>
      Thực hiện thao tác
    </button>
  );
}
```

## Xử lý lỗi tự động

### 1. Lỗi 401 - Unauthorized
Khi gặp lỗi 401, hệ thống sẽ tự động:
- Hiển thị toast thông báo
- Xóa token khỏi localStorage
- Chuyển hướng về trang đăng nhập

### 2. Lỗi 403 - Forbidden
Hiển thị thông báo "Bạn không có quyền thực hiện hành động này"

### 3. Lỗi 404 - Not Found
Hiển thị thông báo "Không tìm thấy tài nguyên yêu cầu"

### 4. Lỗi 422 - Validation Error
Hiển thị thông báo "Dữ liệu không hợp lệ"

### 5. Lỗi 429 - Too Many Requests
Hiển thị thông báo "Quá nhiều yêu cầu. Vui lòng thử lại sau."

### 6. Lỗi 500 - Internal Server Error
Hiển thị thông báo "Lỗi máy chủ. Vui lòng thử lại sau."

## Cấu hình môi trường

Tạo file `.env.local` dựa trên `env.example`:

```bash
# Copy env.example to .env.local
cp env.example .env.local

# Chỉnh sửa các giá trị trong .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=development
```

## Tùy chỉnh Toast

### 1. Thay đổi vị trí hiển thị

```tsx
// Trong layout.tsx, thay đổi position của Toaster
<Toaster position="bottom-right" />
```

### 2. Thay đổi thời gian hiển thị

```tsx
// Trong component
toast.success('Thành công!', { duration: 3000 });

// Hoặc sử dụng ApiHelper
ApiHelper.showSuccess('Thành công!');
```

### 3. Tùy chỉnh style

```tsx
// Trong toaster.tsx, thay đổi classNames
<Sonner
  className="toaster group"
  toastOptions={{
    classNames: {
      toast: "custom-toast-class",
      // ... other custom classes
    },
  }}
/>
```

## Best Practices

1. **Luôn sử dụng ApiHelper** thay vì gọi toast trực tiếp trong components
2. **Xử lý lỗi** với `ApiHelper.handleApiError()` để có thông báo nhất quán
3. **Sử dụng loading toast** cho các thao tác bất đồng bộ
4. **Tùy chỉnh message** phù hợp với ngữ cảnh
5. **Không spam toast** - chỉ hiển thị khi cần thiết
