import { Modal } from "flowbite-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Dependency } from "../../../component/App";
import { Product, productUpdateSchema } from "../model/product_type";
import { LoadingContainer } from "../../../component/LoadingContainer";
import { useProductHook } from "./ProductHook";

export function ProductEdit() {
  const { auth, productController } = useContext(Dependency)!;
  const param = useParams();
  const product = useProductHook(productController);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (product.state.action == "idle" && product.state.status == "idle") {
      product.read(param.id!, { token: auth.state.data! });
    }

    if (
      product.state.action == "update" &&
      product.state.status == "complete"
    ) {
      if (product.state.error == null) {
        toast.success("Produk berhasil di update");

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
      <Modal
        show={location.pathname.includes("/app/product/edit")}
        onClose={() => {
          const target =
            location.state?.from == null
              ? "/app/product?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        <Modal.Header>Edit Produk</Modal.Header>
        <LoadingContainer loading={product.state.data == null}>
          <Modal.Body>
            {(() => {
              const productEdit = product.state.data as Product | null;

              return (
                <Formik
                  enableReinitialize
                  initialValues={{
                    code: productEdit?.code ?? "",
                    name: productEdit?.name ?? "",
                    note: productEdit?.note ?? "",
                  }}
                  validationSchema={productUpdateSchema}
                  onSubmit={(values) => {
                    product.update(param.id!, values, {
                      token: auth.state.data!,
                    });
                  }}
                >
                  <Form className="flex flex-col gap-4">
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
              );
            })()}
          </Modal.Body>
        </LoadingContainer>
      </Modal>
    </>
  );
}
