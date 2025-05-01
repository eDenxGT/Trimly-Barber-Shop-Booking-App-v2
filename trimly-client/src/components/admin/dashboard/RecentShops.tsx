import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShopDashboardData } from "@/types/DashboardListingTypes";
import { Building } from "lucide-react";
import { getSmartDate } from "@/utils/helpers/timeFormatter";

interface RecentShopsProps {
  shops?: ShopDashboardData[];
  isLoading?: boolean;
}

const RecentShops: React.FC<RecentShopsProps> = ({ 
  shops, 
  isLoading = false 
}) => {

  const getStatusBadgeVariant = (status: ShopDashboardData['status']) => {
    switch (status) {
      case 'active':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case 'suspended':
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Recent Shops</CardTitle>
          <CardDescription>Latest 5 barbershops that joined the platform</CardDescription>
        </div>
        <div className="p-2 bg-blue-100 rounded-full">
          <Building className="h-5 w-5 text-blue-700" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="w-full h-8 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shops?.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="font-medium">{shop.name}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`text-xs font-semibold ${getStatusBadgeVariant(shop.status)}`}
                      variant="outline"
                    >
                      {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getSmartDate(shop.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentShops;
