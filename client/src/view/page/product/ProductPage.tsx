import { Button, Pagination, Table, TextInput } from "flowbite-react";
import { useContext, useEffect } from "react";
import { HiPencil, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import { ProductRepository } from "../../../feature/product/product_repository";
import { Repository } from "../../../App";
import { AuthHookType } from "../auth/AuthHook";

export function ProductPage() {
  const { auth }: { auth: AuthHookType } = useContext(Repository);
  const productRepository = new ProductRepository();

  useEffect(() => {
    productRepository
      .list(auth.state.data!.toString(), { search: "udin" })
      .then((result) => {
        console.log(result);
      });
  }, []);

  return (
    <>
      <div className="bg-container rounded p-4 min-h-screen flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
          <Button className="bg-primary text-onprimary text-nowrap">
            <HiPlus className="mr-2 h-5 w-5" />
            <span>Tambah Produk</span>
          </Button>
          <TextInput icon={HiSearch} placeholder="Kode / nama produk" />
        </div>
        <div className="overflow-x-auto">
          <Table striped>
            <Table.Head>
              <Table.HeadCell>Kode</Table.HeadCell>
              <Table.HeadCell>Produk</Table.HeadCell>
              <Table.HeadCell>Catatan</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {[...Array(10)].map((_, i) => {
                return (
                  <Table.Row key={i} className="text-nowrap">
                    <Table.Cell>BD</Table.Cell>
                    <Table.Cell>Bandeng</Table.Cell>
                    <Table.Cell>-</Table.Cell>
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
