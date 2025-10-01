'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Download, 
  Copy, 
  CheckCircle,
  Smartphone,
  RefreshCw
} from 'lucide-react';

interface QRCodeCardProps {
  qrCodeIdentifier: string;
  studentName: string;
  studentId: string;
}

export default function QRCodeCard({ qrCodeIdentifier, studentName, studentId }: QRCodeCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string>('');

  // Generate real QR code using qrcode library
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Create student data object for QR code
        const studentData = {
          id: qrCodeIdentifier,
          name: studentName,
          studentId: studentId,
          type: 'student_checkin',
          timestamp: new Date().toISOString(),
          version: '1.0'
        };

        // Convert to JSON string
        const qrDataString = JSON.stringify(studentData);
        
        const qrDataUrl = await QRCode.toDataURL(qrDataString, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        setQrCodeData(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
        // Fallback to text if QR generation fails
        setQrCodeData('');
      }
    };

    generateQRCode();
  }, [qrCodeIdentifier, studentName, studentId]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeIdentifier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${studentId}.png`;
    link.href = qrCodeData;
    link.click();
  };

  const handleRefreshQR = async () => {
    setIsRefreshing(true);
    // Regenerate QR code
    try {
      // Create student data object for QR code
      const studentData = {
        id: qrCodeIdentifier,
        name: studentName,
        studentId: studentId,
        type: 'student_checkin',
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      // Convert to JSON string
      const qrDataString = JSON.stringify(studentData);
      
      const qrDataUrl = await QRCode.toDataURL(qrDataString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeData(qrDataUrl);
    } catch (error) {
      console.error('Error refreshing QR code:', error);
    }
    setIsRefreshing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Check-in
        </CardTitle>
        <CardDescription>
          Mã QR cá nhân để check-in sự kiện
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-48 h-48 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-white">
              {qrCodeData ? (
                <img 
                  src={qrCodeData} 
                  alt="QR Code" 
                  className="w-44 h-44 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <QrCode className="h-12 w-12 mb-2" />
                  <span className="text-sm">Đang tạo QR Code...</span>
                </div>
              )}
            </div>
            
            {/* Refresh overlay */}
            {isRefreshing && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">{studentName}</h3>
            <p className="text-sm text-gray-500">Mã sinh viên: {studentId}</p>
            <Badge variant="outline" className="font-mono text-xs">
              {qrCodeIdentifier}
            </Badge>
          </div>
        </div>

        {/* QR Code Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>QR Code đã được kích hoạt</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Smartphone className="h-4 w-4 text-blue-500" />
            <span>Quét mã này để check-in sự kiện</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyCode}
            className="flex-1"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Đã copy
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy mã
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadQR}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Tải xuống
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshQR}
            disabled={isRefreshing}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Hướng dẫn sử dụng:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• QR Code chứa thông tin sinh viên đầy đủ (JSON)</li>
            <li>• Hiển thị QR Code này khi check-in sự kiện</li>
            <li>• Ban tổ chức quét QR để lấy thông tin sinh viên</li>
            <li>• Mỗi lần check-in thành công sẽ nhận được điểm thưởng</li>
            <li>• QR Code có thể được làm mới nếu cần thiết</li>
          </ul>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">Lưu ý bảo mật:</h4>
          <p className="text-sm text-yellow-800">
            Không chia sẻ QR Code này với người khác. Mã QR này là định danh duy nhất của bạn 
            và chỉ nên được sử dụng bởi chính bạn để check-in sự kiện.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

