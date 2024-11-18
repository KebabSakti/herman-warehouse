import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoadingContainer } from "../../../component/LoadingContainer";
import { productCreateSchema } from "../model/product_type";
import { useContext, useEffect } from "react";
import { Repository } from "../../../component/App";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "flowbite-react";
import { useProductHook } from "./ProductHook";

export function ProductCreate() {
  const { auth, productController } = useContext(Repository)!;
  const product = useProductHook(productController);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      product.state.action == "create" &&
      product.state.status == "complete"
    ) {
      if (product.state.error == null) {
        toast.success("Produk berhasil ditambahkan");

        const target =
          location.state?.from == null
            ? "/app/product?page=1&limit=10&search="
            : location.state.from;

        navigate(target);
      } else {
        toast.error(product.state.error.message);
      }
    }
  }, [product.state]);

  return (
    <>
      <LoadingContainer loading={product.state.status == "loading"}>
        <Modal
          show={location.pathname.includes("/app/product/create")}
          onClose={() => {
            const target =
              location.state?.from == null
                ? "/app/product?page=1&limit=10&search="
                : location.state.from;

            navigate(target);
          }}
        >
          <Modal.Header>Tambah Produk</Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{ id: uuidv4(), code: "", name: "", note: "" }}
              validationSchema={productCreateSchema}
              onSubmit={(values) => {
                product.create(values, { token: auth.state.data! });
              }}
            >
              <Form className="flex flex-col gap-4">
                <Field
                  type="hidden"
                  name="id"
                  placeholder="ID"
                  className="bg-slate-100 p-3 rounded w-full border-none"
                />
                <div>
                  <Field
                    type="text"
                    name="code"
                    placeholder="Kode Produk"
                    className="bg-slate-100 p-3 rounded w-full border-none"
                  />
                  <ErrorMessage
                    name="code"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Nama Produk"
                    className="bg-slate-100 p-3 rounded w-full border-none"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Field
                    type="text"
                    name="note"
                    placeholder="Catatan"
                    className="bg-slate-100 p-3 rounded w-full border-none"
                  />
                  <ErrorMessage
                    name="note"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-onprimary font-semibold rounded p-3"
                >
                  Submit
                </button>
              </Form>
            </Formik>
          </Modal.Body>
        </Modal>
      </LoadingContainer>
    </>
  );
}
