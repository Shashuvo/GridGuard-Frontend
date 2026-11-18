"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useGetPublicAreas, useBuyPremium } from "@/hooks";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { IPackage } from "@/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMe } from "@/hooks";
import { Lock, MapPin, Zap } from "lucide-react";

interface Props {
  pkg: IPackage | null;
  onClose: () => void;
}

export default function BuyPremiumModal({ pkg, onClose }: Props) {
  const [areaId, setAreaId] = useState("");
  const router = useRouter();

  const { data: meData } = useGetMe();
  const { data: areasData } = useGetPublicAreas();
  const { mutate: buyPremium, isPending } = useBuyPremium();

  const areas = areasData?.data ?? [];

  const handleClose = () => {
    setAreaId("");
    onClose();
  };

  const handleBuy = () => {
    if (!meData?.data) {
      router.push("/login");
      return;
    }

    if (!pkg || !areaId) return;

    buyPremium(
      { packageId: pkg.id, areaId },
      {
        onSuccess: (res) => {
          const paymentUrl = res.data.paymentUrl;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          }
        },
        onError: (err) => {
          toast.error("Payment Failed.", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      }
    );
  };

  return (
    <Dialog open={!!pkg} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="gap-6 rounded-3xl p-6 shadow-xl sm:max-w-md sm:p-8">
        <DialogHeader className="gap-4 text-left">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
            <Zap className="size-6 fill-current" aria-hidden />
          </span>
          <div className="flex flex-col gap-2">
            <DialogTitle className="font-serif text-2xl font-bold tracking-tight">
              Buy {pkg?.name} package
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed">
              Select your area to continue.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Price summary */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-muted/40 p-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{pkg?.name} package</span>
              <span className="text-xs text-muted-foreground">
                {pkg?.durationDays} days coverage
              </span>
            </div>
            <span className="font-serif text-3xl font-bold tracking-tight">
              ৳{pkg?.price}
            </span>
          </div>

          <Field>
            <FieldLabel htmlFor="area">Select area</FieldLabel>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Select
                value={areaId}
                onValueChange={(val) => val && setAreaId(val)}
              >
                <SelectTrigger
                  id="area"
                  className="h-11 w-full rounded-full border-input bg-background pr-4 pl-11 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11"
                >
                  <SelectValue placeholder="Select your area" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start" sideOffset={8} className="rounded-2xl p-1.5">
                  {areas.map((area) => (
                    <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" key={area.id} value={area.id}>
                      {area.name}, {area.district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Field>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-full"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              className="h-11 flex-1 rounded-full font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
              onClick={handleBuy}
              disabled={!areaId || isPending}
            >
              {isPending ? <><Spinner /> Processing</> : "Pay with bKash"}
            </Button>
          </div>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Lock className="size-3.5" aria-hidden />
            You&apos;ll be redirected to bKash to complete your payment.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}