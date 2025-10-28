    'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  TrendingUp, 
  Gift, 
  Star,
  Zap,
  Crown
} from 'lucide-react';

interface PointBalanceCardProps {
  points: number;
  level: string;
  onRedeem?: () => void;
}

const levelConfig = {
  Bronze: {
    color: 'bg-amber-100 text-amber-800',
    icon: <Star className="h-4 w-4" />,
    nextLevel: 500,
    multiplier: 1
  },
  Silver: {
    color: 'bg-gray-100 text-gray-800',
    icon: <Zap className="h-4 w-4" />,
    nextLevel: 1000,
    multiplier: 1.2
  },
  Gold: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <Award className="h-4 w-4" />,
    nextLevel: 2000,
    multiplier: 1.5
  },
  Platinum: {
    color: 'bg-blue-100 text-blue-800',
    icon: <Crown className="h-4 w-4" />,
    nextLevel: 5000,
    multiplier: 2
  },
  Diamond: {
    color: 'bg-purple-100 text-purple-800',
    icon: <Crown className="h-4 w-4" />,
    nextLevel: 10000,
    multiplier: 3
  }
};

export default function PointBalanceCard({ points, level, onRedeem }: PointBalanceCardProps) {
  const currentLevelConfig = levelConfig[level as keyof typeof levelConfig] || levelConfig.Bronze;
  const progress = Math.min((points / currentLevelConfig.nextLevel) * 100, 100);
  const pointsToNext = Math.max(currentLevelConfig.nextLevel - points, 0);

  const getLevelBenefits = () => {
    switch (level) {
      case 'Bronze':
        return ['Ưu đãi cơ bản', 'Tích điểm 1x'];
      case 'Silver':
        return ['Ưu đãi đặc biệt', 'Tích điểm 1.2x', 'Ưu tiên đăng ký'];
      case 'Gold':
        return ['Ưu đãi VIP', 'Tích điểm 1.5x', 'Ưu tiên cao', 'Quà tặng độc quyền'];
      case 'Platinum':
        return ['Ưu đãi Premium', 'Tích điểm 2x', 'Hỗ trợ 24/7', 'Sự kiện riêng'];
      case 'Diamond':
        return ['Ưu đãi tối đa', 'Tích điểm 3x', 'Quản lý cá nhân', 'Quyền lợi đặc biệt'];
      default:
        return ['Ưu đãi cơ bản'];
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              Điểm tích lũy
            </CardTitle>
            <CardDescription>
              Quản lý điểm thưởng và đổi quà
            </CardDescription>
          </div>
          <Badge className={`${currentLevelConfig.color} flex items-center gap-1`}>
            {currentLevelConfig.icon}
            {level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {/* Points Display */}
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {points.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">điểm hiện có</div>
        </div>

        {/* Progress to Next Level */}
        {level !== 'Diamond' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tiến độ lên cấp tiếp theo</span>
              <span className="font-medium">{pointsToNext} điểm nữa</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-500 text-center">
              Cần {currentLevelConfig.nextLevel.toLocaleString()} điểm để lên {getNextLevel(level)}
            </div>
          </div>
        )}

        {/* Level Benefits */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Quyền lợi cấp {level}</h4>
          <div className="space-y-2">
            {getLevelBenefits().map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={onRedeem}
            disabled={points < 100}
          >
            <Gift className="h-4 w-4 mr-2" />
            Đổi quà
          </Button>
          <Button variant="outline" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Lịch sử
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              +{Math.floor(points * 0.1)}
            </div>
            <div className="text-xs text-gray-500">Điểm tháng này</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {currentLevelConfig.multiplier}x
            </div>
            <div className="text-xs text-gray-500">Hệ số tích điểm</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getNextLevel(currentLevel: string): string {
  const levels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const currentIndex = levels.indexOf(currentLevel);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : 'Max Level';
}
