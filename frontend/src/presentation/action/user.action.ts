'use server';

import { AppProviders } from "@/src/provider/provider";
import { User } from "@/src/domain/entity/user.entity";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/src/shared/logOrderActivity";

export async function updateUserProfileAction(id: number, data: Partial<User>) {
  // Determine who is performing the action for the log
  const actor = data.email || data.fullName || `User ID: ${id}`;

  try {
    // 1. Execute the update
    const result = await AppProviders.UpdateUserUseCase.execute(id, data);

    // 2. Log the successful profile update
    // Note: Reusing the helper, but overriding the context in the details
    await logActivity(
      actor,
      "User",
      "UPDATE",
      `User (ID: ${id}) updated their profile information successfully.`
    );

    // 3. Refresh the profile page data
    revalidatePath('/profile');

    return {
      success: true,
      user: JSON.parse(JSON.stringify(result))
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Profile update error:", error);

    // 4. Log the failed attempt
    await logActivity(
      actor,
      "User",
      "UPDATE",
      `Failed profile update for User ID: ${id}. Error: ${error.message}`
    );

    return {
      success: false,
      message: error.message || "Failed to update profile"
    };
  }
}