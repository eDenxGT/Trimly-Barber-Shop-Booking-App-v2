
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
import { Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getSmartDate } from "@/utils/helpers/timeFormatter";
import { ClientDashboardData } from "@/types/DashboardListingTypes";

interface RecentClientsProps {
  clients?: ClientDashboardData[];
  isLoading?: boolean;
}

const RecentClients: React.FC<RecentClientsProps> = ({ 
  clients, 
  isLoading = false 
}) => {

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Recent Clients</CardTitle>
          <CardDescription>Latest 5 clients that joined the platform</CardDescription>
        </div>
        <div className="p-2 bg-purple-100 rounded-full">
          <Users className="h-5 w-5 text-purple-700" />
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
                <TableHead>User ID</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={client.avatar} 
                          alt={client.name}
                        />
                        <AvatarFallback>
                          {client.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{client.userId}</TableCell>
                  <TableCell>{getSmartDate(client.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentClients;
