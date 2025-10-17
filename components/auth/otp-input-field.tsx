"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
  InputOTPGroup,
} from "@/components/ui/input-otp";
import { FormControl, FormMessage, FormItem } from "@/components/ui/form";
import React from "react";

interface OtpInputFieldProps {
  field: any;
  disabled?: boolean;
}

export function OtpInputField({ field, disabled }: OtpInputFieldProps) {
  return (
    <FormItem className="w-full">
      <div className="flex items-center justify-center">
        <FormControl>
          <InputOTP
            {...field}
            disabled={disabled}
            required
            inputMode="numeric"
            maxLength={6}
            onInput={(e) => {
              const input = e.currentTarget;
              input.value = input.value.replace(/\D/g, "");
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </FormControl>
      </div>
      <FormMessage />
    </FormItem>
  );
}
