import { ErrorMessage, Field, Formik, Form } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import { Repository } from "../../../main";

export function LoginPage() {
  const repos = useContext(Repository);

  console.log(repos?.name);

  return (
    <>
      <div className="bg-surface min-h-screen flex justify-center items-center">
        <div className="bg-container p-6 w-[80%] md:w-[35%] xl:w-[25%] rounded">
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={Yup.object({
              username: Yup.string().required("* Field tidak boleh kosong"),
              password: Yup.string().required("* Field tidak boleh kosong"),
            })}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form className="flex flex-col gap-4">
              <img
                src="https://img.freepik.com/free-vector/hand-drawn-catfish-logo-design_23-2151158227.jpg"
                className="w-[80%] md:w-[70%] xl:w-[60%] mx-auto"
              />
              <div>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="bg-slate-100 p-3 rounded w-full"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="bg-slate-100 p-3 rounded w-full"
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
        </div>
      </div>
    </>
  );
}
