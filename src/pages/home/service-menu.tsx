import React, { useState } from 'react';
import TransitionLink from '@/components/transition-link';
import { openWebview } from "zmp-sdk/apis";
import categoriesData from '@/components/mock/categories.json';
import hanhchinhcong from "../../static/image/hanhchinhcong.png";
import dulich from "../../static/image/dulich.png";
import sanpham from "../../static/image/sanpham.png";
import tintuc from "../../static/image/tintuc.png";
import phananh from "../../static/image/phananh.png";
import lichsu from "../../static/image/lichsu.png";
import tracuutthc from "../../static/image/tracuutthc.png";
import tracuuhoso from "../../static/image/tracuuhoso.png";
import bocso from "../../static/image/bocso.png";
import hoidap from "../../static/image/hoidap.png";
import danhgia from "../../static/image/danhgia.png";
import nhahang from "../../static/image/nhahang.png";
import hotline from "../../static/image/hotline.png";
import ttv11 from "../../static/image/ttv11.png";
import thongbao from "../../static/image/thongbao.png";
import khachsan from "../../static/image/khachsan.png";
import homestay from "../../static/image/homestay.png";
import diadiemdulich from "../../static/image/diadiemdulich.png";
import lichsuhinhthanh from "../../static/image/lichsuhinhthanh.png";
import diadiem from "../../static/image/diadiem.png";

  const getImagePath = (path: string) => {
    if (path.startsWith('/src/static/image')) {
      // Lấy tên file từ đường dẫn (không bao gồm phần mở rộng)
      const fileName = path.split('/').pop()?.split('.')[0];

      // Map tên file với biến đã import
      const imageMap: { [key: string]: any } = {
        hanhchinhcong,
        dulich,
        sanpham,
        tintuc,
        phananh,
        lichsu,
        tracuutthc,
        tracuuhoso,
        bocso,
        hoidap,
        danhgia,
        nhahang,
        hotline,
        ttv11,
        thongbao,
        khachsan,
        homestay,
        lichsuhinhthanh,
        diadiem,
        diadiemdulich
      };

      return imageMap[fileName || ''] || '';
    }
    return path;
  };

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

  /**
   * handleOpenUrl - Mở URL bên trong Zalo bằng openWebview ở chế độ style "normal"
   * Lưu ý: Thuộc tính style phải đặt trong config theo type của zmp-sdk
   */
  const handleOpenUrl = async (url: string) => {
    try {
      await openWebview({ url, config: { style: 'normal' } });
    } catch (err) {
      // Tùy chọn: Có thể fallback window.open nếu cần, hiện chỉ thực thi theo yêu cầu
      console.error("openWebview error", err);
    }
  };

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
                    <img src={getImagePath(subcategory.icon)} alt={subcategory.name} className="h-8 w-8" />
                  </div>
                  <span className="text-xs font-medium text-center">{subcategory.name}</span>
                </div>
              );
              
              if (subcategory.url) {
                return (
                  <button
                    key={subcategory.id}
                    type="button"
                    onClick={() => handleOpenUrl(subcategory.url!)}
                    className="block text-left"
                  >
                    {content}
                  </button>
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
        <img src={getImagePath(category.icon)} alt={category.name} className="h-8 w-8" />
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
        {categoriesData.map((category) => (
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
