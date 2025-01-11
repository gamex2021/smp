import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./otp/resendOtp";
import Resend from "@auth/core/providers/resend";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Resend({
      from: process.env.EMAIL_SERVER_FROM!,
    }),
    ResendOTP,
  ],
});
