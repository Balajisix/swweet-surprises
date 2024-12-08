import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-pink-50 p-8 rounded-lg shadow-lg animate-fadeIn">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-pink-800">
          Sign in to your account
        </h1>
        <p className="mt-2 text-pink-700">
          Don’t have an account?{" "}
          <Link
            className="font-medium ml-2 text-pink-600 hover:underline transition duration-200"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <div className="text-center text-pink-600 mt-4">
        <p className="text-sm">Secure and private login experience</p>
      </div>
    </div>
  );
}

export default AuthLogin;
