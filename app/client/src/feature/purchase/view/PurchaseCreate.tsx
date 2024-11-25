import { Pagination, Table } from "flowbite-react";
import { HiOutlineX } from "react-icons/hi";
import { LoadingContainer } from "../../../component/LoadingContainer";
import { Title } from "../../../component/Title";

export function PurchaseCreate() {
  return (
    <>
      <div className="bg-container rounded p-4 min-h-screen flex flex-col gap-4">
        <Title title="BARANG MASUK" />
        <LoadingContainer loading={false}>
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
            <div className="w-full flex flex-col gap-2 lg:w-[70%]">
              <div className="flex flex-col gap-2 lg:flex-row">
                <input
                  type="text"
                  placeholder="Tanggal Masuk"
                  className="bg-slate-100 p-3 rounded w-full h-fit border-none"
                />
                <input
                  type="text"
                  placeholder="Supplier"
                  className="bg-slate-100 p-3 rounded w-full h-fit border-none"
                />
                <button className="bg-secondary text-onsecondary text-nowrap text-center p-2 px-3 rounded-md">
                  Biaya Lain
                </button>
              </div>
              <div className="overflow-x-auto">
                <Table striped hoverable>
                  <Table.Head>
                    <Table.HeadCell></Table.HeadCell>
                    <Table.HeadCell>Produk</Table.HeadCell>
                    <Table.HeadCell className="text-center">
                      Qty (Kg)
                    </Table.HeadCell>
                    <Table.HeadCell className="text-center">
                      Harga
                    </Table.HeadCell>
                    <Table.HeadCell>Total</Table.HeadCell>
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
                              defaultValue={i + 1}
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
                          <Table.Cell>Rp 100.000.000</Table.Cell>
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
                      <Table.Cell className="bg-red-50 text-red-500">
                        Rp 100.000.000
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
                      <Table.Cell className="bg-red-50 text-red-500">
                        Rp 40.000
                      </Table.Cell>
                    </Table.Row>
                    <Table.Row className="text-nowrap font-bold">
                      <Table.Cell className="bg-green-100"></Table.Cell>
                      <Table.Cell colSpan={3} className="bg-green-100">
                        TOTAL
                      </Table.Cell>
                      <Table.Cell className="bg-green-100">
                        Rp 200.000.000
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-secondary text-onsecondary text-nowrap text-center p-2 px-3 rounded-md w-full">
                  Biaya Lain
                </button>
                <button className="bg-primary text-onprimary text-nowrap text-center p-2 px-3 rounded-md w-full">
                  Submit & Cetak Nota
                </button>
              </div>
            </div>
          </div>
        </LoadingContainer>
      </div>
    </>
  );
}
