'use server';

import { AppProviders } from "@/src/provider/provider";

export async function validateVoucherAction(code: string, amount: number) {
  try {
    // We use SearchVouchersUseCase to find the voucher by code
    const voucher = (await AppProviders.ValidateVoucherUseCase.execute(code, amount));
    
    if (!voucher) {
      return { success: false, message: "Voucher code not found." };
    }

    return { success: true, voucher: JSON.parse(JSON.stringify(voucher)) };
  } catch (error) {
    console.error("Error validating voucher:", error);
    return { success: false, message: "An error occurred while validating." };
  }
}