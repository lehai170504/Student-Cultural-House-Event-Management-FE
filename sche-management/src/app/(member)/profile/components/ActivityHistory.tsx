'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Award, 
  History, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Activity {
  id: number;
  type: 'event_attended' | 'event_organized' | 'points_earned' | 'voucher_redeemed' | 'feedback_given';
  title: string;
  description: string;
  date: string;
  points: number;
  status: 'completed' | 'pending' | 'cancelled';
}

interface ActivityHistoryProps {
  activities?: Activity[];
}

const mockActivities: Activity[] = [
  {
    id: 1,
    type: 'event_attended',
    title: 'Tham gia sự kiện "Workshop React"',
    description: 'Tham gia workshop học React cơ bản tại phòng 101',
    date: '2024-01-20T10:00:00Z',
    points: 50,
    status: 'completed'
  },
  {
    id: 2,
    type: 'event_organized',
    title: 'Tổ chức sự kiện "Tech Talk"',
    description: 'Tổ chức buổi chia sẻ về công nghệ mới',
    date: '2024-01-18T14:00:00Z',
    points: 100,
    status: 'completed'
  },
  {
    id: 3,
    type: 'points_earned',
    title: 'Hoàn thành feedback sự kiện',
    description: 'Gửi đánh giá cho sự kiện "Workshop React"',
    date: '2024-01-15T16:30:00Z',
    points: 25,
    status: 'completed'
  },
  {
    id: 4,
    type: 'voucher_redeemed',
    title: 'Đổi voucher giảm giá 20%',
    description: 'Sử dụng 200 điểm để đổi voucher giảm giá',
    date: '2024-01-12T09:15:00Z',
    points: -200,
    status: 'completed'
  },
  {
    id: 5,
    type: 'feedback_given',
    title: 'Gửi phản hồi về sự kiện',
    description: 'Đánh giá chất lượng sự kiện "Tech Talk"',
    date: '2024-01-10T11:45:00Z',
    points: 15,
    status: 'completed'
  }
];

const activityTypes = {
  event_attended: { label: 'Tham gia sự kiện', color: 'bg-green-100 text-green-800', icon: Calendar },
  event_organized: { label: 'Tổ chức sự kiện', color: 'bg-blue-100 text-blue-800', icon: Award },
  points_earned: { label: 'Tích điểm', color: 'bg-yellow-100 text-yellow-800', icon: Award },
  voucher_redeemed: { label: 'Đổi voucher', color: 'bg-purple-100 text-purple-800', icon: Award },
  feedback_given: { label: 'Phản hồi', color: 'bg-orange-100 text-orange-800', icon: Award }
};

const statusConfig = {
  completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  pending: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
};

export default function ActivityHistory({ activities = mockActivities }: ActivityHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || activity.type === filterType;
      const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'points':
          return b.points - a.points;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getActivityIcon = (type: keyof typeof activityTypes) => {
    const IconComponent = activityTypes[type].icon;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch sử hoạt động
          </CardTitle>
          <CardDescription>
            Xem và quản lý tất cả hoạt động của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm hoạt động..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Loại hoạt động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {Object.entries(activityTypes).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Ngày</SelectItem>
                <SelectItem value="points">Điểm</SelectItem>
                <SelectItem value="title">Tên</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy hoạt động nào
              </h3>
              <p className="text-gray-500">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => {
            const typeConfig = activityTypes[activity.type];
            const statusConfigItem = statusConfig[activity.status];
            const isExpanded = expandedItems.has(activity.id);
            
            return (
              <Card key={activity.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {activity.title}
                          </h3>
                          <Badge className={`${typeConfig.color} text-xs`}>
                            {typeConfig.label}
                          </Badge>
                          <Badge className={`${statusConfigItem.color} text-xs`}>
                            {statusConfigItem.label}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(activity.date)}
                        </p>
                        
                        {isExpanded && (
                          <p className="text-sm text-gray-600 mb-3">
                            {activity.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-1 text-sm font-medium ${
                            activity.points > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {activity.points > 0 ? '+' : ''}{activity.points} điểm
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(activity.id)}
                            className="h-6 px-2"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Thu gọn
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 mr-1" />
                                Xem thêm
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary */}
      {filteredActivities.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredActivities.length}
                </div>
                <div className="text-sm text-gray-500">Tổng hoạt động</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  +{filteredActivities
                    .filter(a => a.points > 0)
                    .reduce((sum, a) => sum + a.points, 0)}
                </div>
                <div className="text-sm text-gray-500">Điểm tích lũy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {Math.abs(filteredActivities
                    .filter(a => a.points < 0)
                    .reduce((sum, a) => sum + a.points, 0))}
                </div>
                <div className="text-sm text-gray-500">Điểm đã sử dụng</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
