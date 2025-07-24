import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function ButtonLoading() {
  return (
    <Button size="lg" disabled>
      <Loader2Icon className="animate-spin" />
      Please wait
    </Button>
  );
}
