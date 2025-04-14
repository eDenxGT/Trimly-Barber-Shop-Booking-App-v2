import { IWithdrawal } from "@/types/Wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawalStatus } from "./WithdrawalStatus";

export const WithdrawalsList = ({
  withdrawals,
}: {
  withdrawals: IWithdrawal[];
}) => {
  return (
    <div>
      {withdrawals.length > 0 ? (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-auto">
              {withdrawals.map((withdrawal) => (
                <WithdrawalStatus
                  key={withdrawal.withdrawalId}
                  withdrawal={withdrawal}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No withdrawal requests yet
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
