import { Table } from "flowbite-react";
import { HiPencil, HiTrash } from "react-icons/hi";
import { Link } from "react-router-dom";

export function InventoryPage() {
  return (
    <>
      <div className="bg-container rounded p-4 min-h-screen">
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Kode</Table.HeadCell>
              <Table.HeadCell>Supplier</Table.HeadCell>
              <Table.HeadCell>Kilo</Table.HeadCell>
              <Table.HeadCell>Jumlah</Table.HeadCell>
              <Table.HeadCell>Fee %</Table.HeadCell>
              <Table.HeadCell>DP</Table.HeadCell>
              <Table.HeadCell>Total</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {[...Array(10)].map((_, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.Cell>
                      <Link to="" className="text-primary text-nowrap">
                        INV/SP/{i + 1}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>Udin</Table.Cell>
                    <Table.Cell>200</Table.Cell>
                    <Table.Cell>Rp 3.400.210</Table.Cell>
                    <Table.Cell>Rp 1.500.000</Table.Cell>
                    <Table.Cell>Rp 500.000</Table.Cell>
                    <Table.Cell>Rp 3.500.000</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-1">
                        <button className="p-1 rounded-full bg-cyan-500 hover:bg-cyan-600">
                          <HiPencil className="text-white" />
                        </button>
                        <button className="p-1 rounded-full bg-red-600 hover:bg-red-800">
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
      </div>
    </>
  );
}
