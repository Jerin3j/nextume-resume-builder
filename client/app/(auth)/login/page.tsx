import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}