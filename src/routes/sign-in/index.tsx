import { useAuthContext } from "../../contexts/auth";
import { SignInProps } from "./model";
import Template from "./template";

export default function SignIn() {
  const { signIn } = useAuthContext();

  return <Template onSignIn={signIn} />;
}
