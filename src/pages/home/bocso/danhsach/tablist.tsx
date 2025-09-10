import React, { useState } from 'react';
import Tabs from '@/components/tabs';
import CounterList from './counter-list';
import TicketList from './ticket-list';
import HistoryTicket from '../luubocso/listbook';
/**
 * Component TabList - Quản lý 2 tab: Danh sách quầy và Danh sách bốc số
 */
function TabList() {
  const [activeTab, setActiveTab] = useState(0);

  // Định nghĩa các tab
  const tabs = [
    {
      name: 'Danh sách quầy',
      content: CounterList
    },
    {
      name: 'Theo dõi đến lượt',
      content: TicketList
    },
    {
      name: 'Lịch sử bốc số',
      content: HistoryTicket
    },
  ];

  return (
    <div className="h-screen overflow-y-auto ">
      <Tabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
    </div>
  );
}

export default TabList;