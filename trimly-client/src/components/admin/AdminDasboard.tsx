import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Scissors,
	User,
	FileText,
	DollarSign,
} from "lucide-react";

export function AdminDashboard() {
	const [progress, setProgress] = useState(33);

	return (
		<main className="min-h-screen">
			{/* Stats Dashboard Section */}
			<section className="w-full py-8 mt-10 sm:py-12 bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
						<Card className="bg-gray-50 border-none shadow-sm">
							<CardContent className="p-4 flex items-center gap-4">
								<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
									<User className="w-5 h-5 text-red-500" />
								</div>
								<div>
									<p className="text-2xl font-bold">2</p>
									<p className="text-sm text-gray-500">
										Total Users
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-50 border-none shadow-sm">
							<CardContent className="p-4 flex items-center gap-4">
								<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
									<FileText className="w-5 h-5 text-green-500" />
								</div>
								<div>
									<p className="text-2xl font-bold">400</p>
									<p className="text-sm text-gray-500">
										Total Works
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-50 border-none shadow-sm">
							<CardContent className="p-4 flex items-center gap-4">
								<div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
									<DollarSign className="w-5 h-5 text-gray-700" />
								</div>
								<div>
									<p className="text-2xl font-bold">
										$10,461,767
									</p>
									<p className="text-sm text-gray-500">
										USD Total Earning
									</p>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-50 border-none shadow-sm">
							<CardContent className="p-4 flex items-center gap-4">
								<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
									<Scissors className="w-5 h-5 text-purple-500" />
								</div>
								<div>
									<p className="text-2xl font-bold">30</p>
									<p className="text-sm text-gray-500">
										Total Barbers
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
					{/* 
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white border shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Earnings</h3>
                  <Select defaultValue="today">
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue placeholder="Today" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[200px] flex items-end gap-1">
                  {[40, 65, 30, 70, 90, 50, 75, 45, 60, 35].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full ${i === 2 || i === 4 ? "bg-green-500" : "bg-green-100"} rounded-t`}
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">$7,443</p>
                  <p className="text-sm text-gray-500">USD Dollar you earned.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Total Revenue</h3>
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue placeholder="This month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative h-[200px] bg-purple-50 rounded-md overflow-hidden">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-[80px]">
                      <svg viewBox="0 0 100 20" className="w-full h-full">
                        <path
                          d="M0,10 Q10,5 20,10 T40,10 T60,15 T80,5 T100,10"
                          fill="none"
                          stroke="rgb(79, 70, 229)"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-white p-2 rounded shadow-md text-xs">
                      <p className="font-bold">$1,749</p>
                      <p className="text-gray-500">7th May</p>
                    </div>
                  </div>
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-10 ml-2">
                    <div className="w-3 h-3 bg-white border-2 border-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card> 
          </div> */}
          <h1 className="text-center font-bold">Welcome to Admin Dashboard 💥</h1>
				</div>
			</section>
		</main>
	);
}
