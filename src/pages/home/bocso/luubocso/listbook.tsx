import React, { useState, useEffect } from 'react';
import { Text, Box, List, Icon } from 'zmp-ui';
import { getUserInfo } from "zmp-sdk/apis";

// Interface cho dữ liệu lịch sử bốc số
interface HistoryRecord {
  id: number;
  issue_time: string;
  department_name: string;
  counter_name: string;
  service_name: string;
  queue_number: string;
  status: string;
  wait_time_minutes: number;
  service_time_minutes: number;
}

// Interface cho thống kê tổng quan
interface HistorySummary {
  total_visits: number;
  first_visit: string | null;
  last_visit: string | null;
  departments_visited: number;
  counters_used: number;
  services_used: number;
  unique_visit_days: number;
  completed_visits: number;
  cancelled_visits: number;
  waiting_visits: number;
  serving_visits: number;
  avg_service_time_minutes: number | null;
  avg_wait_time_minutes: number | null;
}

// Interface cho response API
interface HistoryResponse {
  success: boolean;
  data: {
    records: HistoryRecord[];
    summary: HistorySummary;
  };
  total_records: number;
  timestamp: string;
}

/**
 * Component ListBook - Hiển thị danh sách lịch sử bốc số của người dùng
 */
function ListBook() {
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [summary, setSummary] = useState<HistorySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  /**
   * Lấy dữ liệu lịch sử từ API
   */
  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lấy thông tin user từ ZMP SDK
      const { userInfo } = await getUserInfo({});
      
      if (!userInfo || !userInfo.id) {
        throw new Error('Không thể lấy thông tin người dùng');
      }
      
      const response = await fetch(
        `https://demo8.tayninh.gov.vn/backend/api/stats/customer_search.php?zaloid=${userInfo.id}`
      );
      
      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu lịch sử');
      }
      
      const data: HistoryResponse = await response.json();
      
      if (data.success) {
        setHistoryData(data.data.records);
        setSummary(data.data.summary);
      } else {
        throw new Error('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  /**
   * Định dạng ngày tháng với xử lý lỗi
   */
  const formatDate = (dateString: string) => {
    if (!dateString) {
      return 'Không có thông tin';
    }
    
    const date = new Date(dateString);
    
    // Kiểm tra nếu date không hợp lệ
    if (isNaN(date.getTime())) {
      return 'Ngày không hợp lệ';
    }
    
    try {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString; // Trả về chuỗi gốc nếu không format được
    }
  };

  /**
   * Lấy màu sắc theo trạng thái
   */
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'hoàn thành':
        return 'text-green-600';
      case 'cancelled':
      case 'đã hủy':
        return 'text-red-600';
      case 'waiting':
      case 'đang chờ':
        return 'text-yellow-600';
      case 'serving':
      case 'đang phục vụ':
        return 'text-blue-600';
      case 'called':
      case 'đã gọi':
        return 'text-purple-600';
      case 'skipped':
      case 'đã bỏ qua':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  /**
   * Lấy text trạng thái tiếng Việt
   */
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
       case "waiting":
                return "Đang chờ";
            case "called":
                return "Đã gọi";
            case "serving":
                return "Đang phục vụ";
            case "completed":
                return "Hoàn thành";
            case "cancelled":
                return "Đã hủy";
            case "skipped":
                return "Đã bỏ qua";
            default:
                return status;
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <Icon icon="zi-close-circle" className="text-red-500 mr-2" />
            <Text className="text-red-700">{error}</Text>
          </div>
          <button 
            onClick={fetchHistoryData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  /**
   * Lọc dữ liệu theo trạng thái được chọn
   */
  const filteredData = historyData.filter(record => {
    if (selectedFilter === 'all') return true;
    return record.status.toLowerCase() === selectedFilter;
  });

  /**
   * Các filter buttons
   */
  const filterButtons = [
    { key: 'all', label: 'Tất cả', count: historyData.length },
    { key: 'waiting', label: 'Đang chờ', count: historyData.filter(r => r.status.toLowerCase() === 'waiting').length },
    { key: 'completed', label: 'Hoàn thành', count: historyData.filter(r => r.status.toLowerCase() === 'completed').length },
    { key: 'skipped', label: 'Đã bỏ qua', count: historyData.filter(r => r.status.toLowerCase() === 'skipped').length },
    { key: 'cancelled', label: 'Đã hủy', count: historyData.filter(r => r.status.toLowerCase() === 'cancelled').length }
  ];

  return (
    <div className="bg-white">
      {/* Filter buttons */}
      {!loading && !error && historyData.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <Text className="text-sm font-medium text-gray-700 mb-3">Lọc theo trạng thái:</Text>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Danh sách lịch sử */}
      <div className="p-4">
        {filteredData.length === 0 ? (
          selectedFilter !== 'all' ? (
            <div className="text-center py-8">
              <Icon icon="zi-search" className="text-gray-400 text-4xl mb-3" />
              <Text className="text-gray-500">Không có dữ liệu cho trạng thái này</Text>
              <button 
                onClick={() => setSelectedFilter('all')}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                Xem tất cả
              </button>
            </div>
           ) : (
             <div className="text-center py-8">
               <Icon icon="zi-calendar" className="text-gray-400 text-4xl mb-3" />
               <Text className="text-gray-500">Chưa có lịch sử bốc số nào</Text>
               <Text className="text-sm text-gray-400 mt-1">
                 Hãy bắt đầu bốc số để xem lịch sử tại đây
               </Text>
             </div>
           )
        ) : (
          <List>
            {filteredData.map((record) => (
              <List.Item
                key={record.id}
                className="mb-3 border border-gray-200 rounded-lg"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <Text className="font-semibold text-gray-800">
                        Số thứ tự: {record.queue_number}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        {formatDate(record.issue_time)}
                      </Text>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)} bg-opacity-10`}>
                      {getStatusText(record.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Icon icon="zi-location" className="text-gray-400 mr-2" />
                      <Text className="text-sm text-gray-700">
                        {record.department_name}
                      </Text>
                    </div>
                    
                    <div className="flex items-center">
                      <Icon icon="zi-user" className="text-gray-400 mr-2" />
                      <Text className="text-sm text-gray-700">
                        Quầy: {record.counter_name}
                      </Text>
                    </div>
                    
                    <div className="flex items-center">
                      <Icon icon="zi-star" className="text-gray-400 mr-2" />
                      <Text className="text-sm text-gray-700">
                        Dịch vụ: {record.service_name}
                      </Text>
                    </div>
                    
                    {record.wait_time_minutes > 0 && (
                      <div className="flex items-center">
                        <Icon icon="zi-clock-1" className="text-gray-400 mr-2" />
                        <Text className="text-sm text-gray-700">
                          Thời gian chờ: {record.wait_time_minutes} phút
                        </Text>
                      </div>
                    )}
                    
                    {record.service_time_minutes > 0 && (
                      <div className="flex items-center">
                        <Icon icon="zi-clock-2" className="text-gray-400 mr-2" />
                        <Text className="text-sm text-gray-700">
                          Thời gian phục vụ: {record.service_time_minutes} phút
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
        )}
      </div>
    </div>
  );
}

export default ListBook;