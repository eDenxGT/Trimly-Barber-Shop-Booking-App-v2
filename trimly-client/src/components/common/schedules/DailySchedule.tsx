import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ScheduleItemProps {
  time: string;
  name?: string;
  task?: string;
  color?: string;
  avatar?: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ 
  time, 
  name, 
  task, 
  color = "bg-transparent",
  avatar
}) => {
  return (
    <div className="flex items-start mb-6">
      <div className="w-16 text-sm text-gray-500">{time}</div>
      {name ? (
        <div className={cn("flex-1 p-2 rounded-md flex items-center gap-2", color)}>
          {avatar && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="text-sm font-medium">{name}</p>
            {task && <p className="text-xs text-gray-500">{task}</p>}
          </div>
        </div>
      ) : (
        <div className="flex-1 border-t border-dashed border-gray-200 mt-3"></div>
      )}
    </div>
  );
};

export const DailySchedule: React.FC = () => {
  return (
    <div className="space-y-1">
      <ScheduleItem time="08:00 am" />
      <ScheduleItem 
        time="08:30 am" 
        name="Adam Carl" 
        task="Check-up"
        color="bg-orange-100"
        avatar="/lovable-uploads/d015b30e-f3d8-4f41-ab85-f5e2512c0488.png"
      />
      <ScheduleItem time="09:00 am" 
        name="Sergio Weil" 
        task="Check-up"
        color="bg-indigo-100"
        avatar="/lovable-uploads/d015b30e-f3d8-4f41-ab85-f5e2512c0488.png"
      />
      <ScheduleItem time="09:30 am" />
      <ScheduleItem time="10:00 am"
        name="Sergio Weil" 
        task="Consultation"
        color="bg-indigo-100"
        avatar="/lovable-uploads/d015b30e-f3d8-4f41-ab85-f5e2512c0488.png"
      />
      <ScheduleItem time="10:30 am" />
      <ScheduleItem time="11:00 am" />
    </div>
  );
};
