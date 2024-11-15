import { Modal } from "flowbite-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { LoadingContainer } from "../../component/LoadingContainer";

export function InventoryCreate() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Modal
        show={location.pathname.includes("/app/inventory/create")}
        onClose={() => {
          const target =
            location.state?.from == null
              ? "/app/inventory?page=1&limit=10&search="
              : location.state.from;

          navigate(target);
        }}
      >
        <Modal.Header>Barang Masuk</Modal.Header>
        <LoadingContainer loading={false}>
          <Modal.Body>
            {(() => {
              return (
                <Formik
                  enableReinitialize
                  initialValues={{
                    supplierId: "",
                  }}
                  validationSchema={object({
                    supplierId: string().required("Pilih salah satu"),
                  })}
                  onSubmit={(values) => {
                    console.log(values);
                  }}
                >
                  <Form className="flex flex-col gap-4">
                    <div>
                      <Field
                        as="select"
                        name="supplierId"
                        className="bg-slate-100 p-3 rounded w-full border-none"
                      >
                        <option value=""> - Pilih Supplier - </option>
                        <option value="1">Udin</option>
                        <option value="2">Petow</option>
                      </Field>
                      <ErrorMessage
                        name="supplierId"
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
