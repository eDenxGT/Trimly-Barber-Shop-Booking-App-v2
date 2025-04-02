import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  FileText,
  DollarSign,
  Layers,
  CalendarDays
} from "lucide-react";
import { StatCard } from "../common/cards/StatCard";
import { EarningsChart } from "../common/charts/EarningsChart";
import { RevenueChart } from "../common/charts/RevenueChart";
import { DailySchedule } from "../common/schedules/DailySchedule";

export const BarberDashboard = () => {
  const [day, setDay] = useState<Date | undefined>(new Date());
  
  return (
    <div className="min-h-screen mt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Team Members" 
            value="2" 
            icon={<Users className="h-6 w-6 text-red-500" />}
            iconBg="bg-red-100"
          />
          <StatCard 
            title="Total Works" 
            value="400" 
            icon={<FileText className="h-6 w-6 text-green-500" />}
            iconBg="bg-green-100"
          />
          <StatCard 
            title="USD Total Earning" 
            value="$10,461,767" 
            icon={<DollarSign className="h-6 w-6 text-gray-500" />}
            iconBg="bg-gray-100"
          />
          <StatCard 
            title="Total Services" 
            value="30" 
            icon={<Layers className="h-6 w-6 text-indigo-500" />}
            iconBg="bg-indigo-100"
          />
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Earnings</h3>
                <Select defaultValue="today">
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <EarningsChart />
              <div className="mt-4">
                <h3 className="text-2xl font-bold">$7,443</h3>
                <p className="text-sm text-gray-500">USD Dollar you earned.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Total Revenue</h3>
                <Select defaultValue="month">
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <RevenueChart />
            </CardContent>
          </Card>
        </div>
        
        {/* Schedule Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Today's Schedule</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64">
                <div className="mb-4 flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  <Select defaultValue="today">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">28 Aug 2023</SelectItem>
                      <SelectItem value="tomorrow">29 Aug 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* <Calendar
                  mode="single"
                  selected={day}
                  onSelect={setDay}
                  className="rounded-md border"
                /> */}
              </div>
              <Separator orientation="vertical" className="hidden md:block" />
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-4">Timeline</h3>
                <DailySchedule />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};