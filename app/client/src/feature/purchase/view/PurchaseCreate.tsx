import { Table } from "flowbite-react";
import { HiOutlineX } from "react-icons/hi";
import { Title } from "../../../component/Title";

export function PurchaseCreate() {
  return (
    <>
      <div className="bg-container rounded p-4 min-h-screen flex flex-col gap-4">
        <Title title="BUAT NOTA BARU" />
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-col gap-2 xl:flex-row-reverse justify-between">
            <div className="flex flex-col gap-2 xl:justify-end xl:flex-row">
              <button className="border border-primary text-primary text-nowrap text-center p-2 px-3 rounded-md">
                Tambah Item
              </button>
              <button className="border border-primary text-primary text-nowrap text-center p-2 px-3 rounded-md">
                Tambah Biaya Lain
              </button>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              <Combobox value={""} onChange={() => {}} onClose={() => {}}>
                <ComboboxInput
                  // displayValue={(person) => "UDIN"}
                  // onChange={(event) => {}}
                  placeholder="Supplier"
                  className="bg-slate-100 p-3 rounded w-full h-fit border-none"
                />
                <ComboboxOptions
                  anchor="bottom"
                  className="border w-[var(--input-width)] mt-1 bg-container shadow empty:invisible"
                >
                  {[...Array(10)].map((_, i) => (
                    <ComboboxOption
                      key={i}
                      value={`Nama orang ${i}`}
                      className="data-[focus]:bg-slate-100 p-2"
                    >
                      Nama orang {i}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </Combobox>
              <input
                type="text"
                placeholder="Tanggal"
                className="bg-slate-100 p-3 rounded w-full h-fit border-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table striped hoverable>
              <Table.Head>
                <Table.HeadCell></Table.HeadCell>
                <Table.HeadCell>Produk</Table.HeadCell>
                <Table.HeadCell>Qty (Kg)</Table.HeadCell>
                <Table.HeadCell>Harga</Table.HeadCell>
                <Table.HeadCell className="text-end">Total</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {[...Array(12)].map((_, i) => {
                  return (
                    <Table.Row key={i} className="text-nowrap">
                      <Table.Cell>
                        <button className="h-6 w-6 bg-red-500 text-white rounded flex items-center justify-center">
                          <HiOutlineX />
                        </button>
                      </Table.Cell>
                      <Table.Cell>Nama produk {i}</Table.Cell>
                      <Table.Cell>
                        <input
                          type="number"
                          min={1}
                          defaultValue={1}
                          className="rounded w-24 text-center border border-slate-100"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <input
                          type="text"
                          defaultValue={10000}
                          className="rounded w-28 text-center border border-slate-100"
                        />
                      </Table.Cell>
                      <Table.Cell className="text-end">
                        Rp 100.000.000
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
                <Table.Row className="text-nowrap">
                  <Table.Cell className="bg-red-50">
                    <button className="h-6 w-6 bg-red-500 text-white rounded flex items-center justify-center">
                      <HiOutlineX />
                    </button>
                  </Table.Cell>
                  <Table.Cell colSpan={3} className="bg-red-50">
                    Sewa Kapal
                  </Table.Cell>
                  <Table.Cell className="bg-red-50 text-red-500 text-end">
                    - Rp 100.000.000
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="text-nowrap">
                  <Table.Cell className="bg-red-50"></Table.Cell>
                  <Table.Cell colSpan={2} className="bg-red-50">
                    Fee %
                  </Table.Cell>
                  <Table.Cell className="bg-red-50">
                    <input
                      type="number"
                      min={0}
                      defaultValue={4}
                      className="rounded w-28 text-center border border-slate-100"
                    />
                  </Table.Cell>
                  <Table.Cell className="bg-red-50 text-red-500 text-end">
                    - Rp 40.000
                  </Table.Cell>
                </Table.Row>
                <Table.Row className="text-nowrap font-bold">
                  <Table.Cell className="bg-green-100"></Table.Cell>
                  <Table.Cell colSpan={3} className="bg-green-100">
                    TOTAL
                  </Table.Cell>
                  <Table.Cell className="bg-green-100 text-end">
                    Rp 200.000.000
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>

          <div className="flex flex-col gap-2 xl:justify-between xl:flex-row-reverse">
            <div className="flex flex-col gap-2 xl:flex-row">
              <button className="border border-primary text-primary text-nowrap text-center p-2 px-3 rounded-md">
                Tambah Item
              </button>
              <button className="border border-primary text-primary text-nowrap text-center p-2 px-3 rounded-md">
                Tambah Biaya Lain
              </button>
            </div>
            <button className="bg-primary text-onprimary text-nowrap text-center p-2 px-3 rounded-md">
              Submit & Cetak Nota
            </button>
          </div>
        </div>
        {/* <LoadingContainer loading={false}>
          <div className="flex flex-col gap-4 xl:flex-row">
            <div className="w-full flex flex-col gap-2">
              <input
                type="text"
                placeholder="Kode / nama produk"
                className="bg-slate-100 p-3 rounded w-full border-none"
              />
              <div className="grid grid-cols-2 gap-2 2xl:grid-cols-4">
                {[...Array(16)].map((_, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-col h-[140px] gap-4 border p-2 items-center justify-between rounded"
                    >
                      <div className="text-center text-wrap">
                        <div>BD</div>
                        <div>Nama ikan asd asd asd asd  {i}</div>
                      </div>
                      <div className="flex gap-1 h-8">
                        <button className="w-8 h-8 bg-red-500 text-onprimary rounded">
                          -
                        </button>
                        <input
                          type="text"
                          defaultValue={0}
                          className="rounded w-12 text-center border border-slate-100 text-sm"
                        />
                        <button className="w-8 h-8 bg-green-500 text-onprimary rounded">
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center">
                <Pagination
                  layout="navigation"
                  currentPage={1}
                  totalPages={100}
                  onPageChange={(_) => {
                    //
                  }}
                />
              </div>
            </div>
            
          </div>
        </LoadingContainer> */}
      </div>
      <MyModal />
    </>
  );
}

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { useState } from "react";

export default function MyModal() {
  let [isOpen, setIsOpen] = useState(true);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <Dialog open={isOpen} className="relative z-50" onClose={close}>
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-container shadow-xl p-4"
            // onClick={close}
          ></DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
