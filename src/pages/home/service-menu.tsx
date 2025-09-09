import React, { useState } from 'react';
import TransitionLink from '@/components/transition-link';
import categoriesData from '@/components/mock/categories.json';

// Interface cho dữ liệu category
interface Subcategory {
  id: number;
  idcha: number;
  name: string;
  icon: string;
  page?: string;
  url?: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  subcategories?: Subcategory[];
}

// Tạo map URL ảnh từ thư mục src/static/image để dùng runtime
// Vite sẽ trả về URL đã được xử lý (dev/build) -> phù hợp cho img.src
const imageUrls = import.meta.glob('@/static/image/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/**
 * resolveIconPath
 * - Nhận đường dẫn icon từ JSON (ví dụ "/src/static/image/hanhchinhcong.png" hoặc "@/static/image/phananh.png").
 * - Trích tên file và tìm URL tương ứng từ imageUrls.
 * - Nếu không tìm thấy, trả lại chuỗi gốc như fallback.
 */
function resolveIconPath(iconPath: string): string {
  if (!iconPath) return iconPath;
  const fileName = iconPath.split('/').pop() || iconPath;
  const match = Object.entries(imageUrls).find(([key]) => key.endsWith(`/image/${fileName}`));
  return match ? match[1] : iconPath;
}

/**
 * prepareCategoriesWithResolvedIcons
 * - Map dữ liệu categories để chuyển icon thành URL hợp lệ cho <img src>.
 */
function prepareCategoriesWithResolvedIcons(data: Category[]): Category[] {
  return data.map((cat) => ({
    ...cat,
    icon: resolveIconPath(cat.icon),
    subcategories: cat.subcategories?.map((sub) => ({
      ...sub,
      icon: resolveIconPath(sub.icon),
    })),
  }));
}

// Component popup hiển thị subcategories
function SubcategoryPopup({ 
  category, 
  isOpen, 
  onClose 
}: { 
  category: Category | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 m-4 max-w-md w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{category.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        {category.subcategories && category.subcategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {category.subcategories.map((subcategory) => {
              const content = (
                <div className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-10 w-10 flex items-center justify-center">
                    <img src={subcategory.icon} alt={subcategory.name} className="h-8 w-8" />
                  </div>
                  <span className="text-xs font-medium text-center">{subcategory.name}</span>
                </div>
              );
              
              if (subcategory.url) {
                return (
                  <a 
                    key={subcategory.id}
                    href={subcategory.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              } else if (subcategory.page) {
                return (
                  <TransitionLink key={subcategory.id} to={subcategory.page}>
                    {content}
                  </TransitionLink>
                );
              }
              
              return (
                <div key={subcategory.id} className="cursor-not-allowed opacity-50">
                  {content}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Chưa có dịch vụ con</p>
        )}
      </div>
    </div>
  );
}

// Component item cho category
function CategoryItem({ 
  category, 
  onClick 
}: { 
  category: Category; 
  onClick: () => void; 
}) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="h-9 w-9 flex items-center justify-center">
        <img src={category.icon} alt={category.name} className="h-8 w-8" />
      </div>
      <div className="text-xs text-center w-full">{category.name}</div>
    </button>
  );
}

/**
 * Component ServiceMenu - Hiển thị menu dịch vụ với popup cho subcategories
 * Sử dụng dữ liệu từ categories.json
 */
export default function ServiceMenu() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Chuẩn hóa icon -> URL hợp lệ để hiển thị ảnh
  const categories: Category[] = prepareCategoriesWithResolvedIcons(categoriesData as unknown as Category[]);
  
  // Xử lý khi click vào category
  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setSelectedCategory(category);
      setIsPopupOpen(true);
    }
  };
  
  // Đóng popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCategory(null);
  };
  
  return (
    <>
      <div className="bg-white bg-opacity-80 grid grid-cols-3 gap-4 p-4 rounded-xl drop-shadow-xl">
        {categories.map((category) => (
          <CategoryItem 
            key={category.id}
            category={category}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
      
      <SubcategoryPopup 
        category={selectedCategory}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </>
  );
}
