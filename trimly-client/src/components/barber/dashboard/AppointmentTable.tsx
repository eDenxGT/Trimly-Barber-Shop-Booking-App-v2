import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentData } from "@/types/DashboardListingTypes";

const AppointmentTable = ({
  appointmentsData,
}: {
  appointmentsData: AppointmentData[];
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Upcoming Appointments for Today</CardTitle>
        <CardDescription>Next scheduled appointments</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointmentsData.length > 0 ? (
              appointmentsData.map((appointment) => (
                <TableRow key={appointment.bookingId}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={appointment.clientAvatar}
                        alt={appointment.clientName}
                      />
                      <AvatarFallback>
                        {appointment.clientName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{appointment.clientName}</span>
                  </TableCell>
                  <TableCell>{appointment.timeSlot}</TableCell>
                  <TableCell>{appointment.services.join(", ")}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status === "confirmed"
                        ? "Confirmed"
                        : "Cancelled"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No appointments scheduled/remaining.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AppointmentTable;
