import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string } from "yup";
import { Repository } from "../../../App";
import { LoadingContainer } from "../../../view/component/LoadingContainer";

export function LoginPage() {
  const { user } = useContext(Repository)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (user.state.action == "login" && user.state.data != null) {
      navigate("/app");
    }

    if (user.state.error != null) {
      toast.error(user.state.error.message);
    }
  }, [user.state]);

  return (
    <>
      <div className="bg-surface min-h-screen flex justify-center items-center">
        <div className="bg-container w-[80%] md:w-[35%] xl:w-[25%] rounded">
          <LoadingContainer loading={user.state.status == "loading"}>
            <Formik
              initialValues={{ uid: "", password: "" }}
              validationSchema={object({
                uid: string().required("* Field tidak boleh kosong"),
                password: string().required("* Field tidak boleh kosong"),
              })}
              onSubmit={user.login}
            >
              <Form className="flex flex-col gap-4 p-6">
                <img
                  src="https://img.freepik.com/free-vector/hand-drawn-catfish-logo-design_23-2151158227.jpg"
                  className="w-[80%] md:w-[70%] xl:w-[60%] mx-auto"
                />
                <div>
                  <Field
                    type="text"
                    name="uid"
                    placeholder="Username"
                    className="bg-slate-100 p-3 rounded w-full border-none"
                  />
                  <ErrorMessage
                    name="uid"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="bg-slate-100 p-3 rounded w-full border-none"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-onprimary font-semibold rounded p-3"
                >
                  Login
                </button>
                <a href="" className="text-center text-oncontainer">
                  Forgot your password?
                </a>
              </Form>
            </Formik>
          </LoadingContainer>
        </div>
      </div>
    </>
  );
}
