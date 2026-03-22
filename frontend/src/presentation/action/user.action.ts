'use server';

import { AppProviders } from "@/src/provider/provider";
import { User } from "@/src/domain/entity/user.entity";
import { revalidatePath } from "next/cache";

export async function updateUserProfileAction(id: number, data: Partial<User>) {
  try {
    // We remove fields that shouldn't be updated directly via profile form
    const { ...updateData } = data;
    
    const result = await AppProviders.UpdateUserUseCase.execute(id, updateData);
    
    revalidatePath('/profile');
    return { success: true, user: JSON.parse(JSON.stringify(result)) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update profile" };
  }
}