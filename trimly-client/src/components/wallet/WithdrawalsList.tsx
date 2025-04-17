import { IWithdrawal } from "@/types/Wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawalStatus } from "./WithdrawalStatus";

export const WithdrawalsList = ({
  withdrawals,
}: {
  withdrawals: IWithdrawal[];
}) => {
  return (
    <div className="h-full"> {/* Full height container */}
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent className="max-h-50 overflow-y-scroll flex-1 p-4">
          {withdrawals.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {withdrawals.map((withdrawal) => (
                <WithdrawalStatus
                  key={withdrawal.withdrawalId}
                  withdrawal={withdrawal}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No withdrawal requests yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
