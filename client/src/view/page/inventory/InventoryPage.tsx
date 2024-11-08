import {
  Button,
  Datepicker,
  Pagination,
  Table,
  TextInput,
} from "flowbite-react";
import {
  HiArrowRight,
  HiDownload,
  HiPencil,
  HiSearch,
  HiTrash,
} from "react-icons/hi";
import { Link } from "react-router-dom";

export function InventoryPage() {
  return (
    <>
      <div className="bg-container rounded p-4 min-h-screen flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
          <Button className="bg-primary text-onprimary text-nowrap">
            <HiDownload className="mr-2 h-5 w-5" />
            <span>Barang Masuk</span>
          </Button>
          <div className="flex gap-2 items-center">
            <Datepicker />
            <HiArrowRight className="text-oncontainer" />
            <Datepicker />
            <TextInput icon={HiSearch} placeholder="Kode / nama supplier" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Kode</Table.HeadCell>
              <Table.HeadCell>Supplier</Table.HeadCell>
              <Table.HeadCell>Jumlah</Table.HeadCell>
              <Table.HeadCell>Fee %</Table.HeadCell>
              <Table.HeadCell>Bayar</Table.HeadCell>
              <Table.HeadCell>Total</Table.HeadCell>
              <Table.HeadCell>Tanggal</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {[...Array(10)].map((_, i) => {
                return (
                  <Table.Row key={i} className="text-nowrap">
                    <Table.Cell>
                      <Link to="" className="text-primary text-nowrap">
                        INV/SP/{i + 1}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>Udin</Table.Cell>
                    <Table.Cell>Rp 3.400.210</Table.Cell>
                    <Table.Cell>Rp 1.500.000</Table.Cell>
                    <Table.Cell>Rp 500.000</Table.Cell>
                    <Table.Cell>Rp 3.500.000</Table.Cell>
                    <Table.Cell>11 Nov 24</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-1">
                        <button className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-600">
                          <HiPencil className="text-white" />
                        </button>
                        <button className="p-2 rounded-full bg-red-600 hover:bg-red-700">
                          <HiTrash className="text-white" />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
        <div className="w-full flex justify-center lg:justify-start">
          <Pagination
            layout="navigation"
            currentPage={1}
            totalPages={100}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </>
  );
}
