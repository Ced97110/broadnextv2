import { cookies } from "next/headers";
import { z } from "zod";

const cartSchema = z.array(
    z.object({
      id: z.string(),
    }),
  );

export async function getWatchlist() {
    const cart = (await cookies()).get("id");
    if (!cart) {
      return [];
    }
    try {
      return cartSchema.parse(JSON.parse(cart.value));
    } catch {
      console.error("Failed to parse cart cookie");
      return [];
    }
  }