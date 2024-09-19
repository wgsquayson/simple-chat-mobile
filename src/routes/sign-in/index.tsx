import { useEffect } from "react";
import { useAuthContext } from "../../contexts/auth";
import { SignInProps } from "./model";
import Template from "./template";

export default function SignIn({ navigation }: SignInProps) {
  const { signIn } = useAuthContext();

  return <Template onSignIn={signIn} />;
}
