import { Pagination, Table, TextInput } from "flowbite-react";
import { useContext, useEffect } from "react";
import { HiPencil, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Repository } from "../../../App";
import { Result } from "../../../common/type";
import { LoadingContainer } from "../../../view/component/LoadingContainer";
import { Product } from "../model/product_type";
import { useProductHook } from "./ProductHook";

export function ProductList() {
  const { auth, productController } = useContext(Repository)!;
  const product = useProductHook(productController);
  const result = product.state.data as Result<Product[]> | null;
  const location = useLocation();
  const [search, setSearch] = useSearchParams({
    page: "1",
    limit: "10",
    search: "",
  });
  const param: any = Object.fromEntries(search.entries());

  useEffect(() => {
    if (
      product.state.action == "remove" &&
      product.state.status == "complete" &&
      product.state.error == null
    ) {
      product.list(param, { token: auth.state.data! });
      toast.success("Produk berhasil dihapus");
    }

    if (product.state.status == "complete" && product.state.error != null) {
      product.list(param, { token: auth.state.data! });
      toast.error(product.state.error.message);
    }
  }, [product.state]);

  useEffect(() => {
    if (search.size == 3) {
      product.list(param, { token: auth.state.data! });
    }
  }, [search]);

  return (
    <>
      <div className="bg-container rounded p-4 min-h-screen flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
          <Link
            to="/app/product/create"
            state={{
              from: location.pathname + location.search,
            }}
            className="bg-primary text-onprimary text-nowrap flex items-center p-2 px-3 rounded-md"
          >
            <HiPlus className="mr-2 h-5 w-5" />
            <span>Tambah Produk</span>
          </Link>
          <TextInput
            icon={HiSearch}
            placeholder="Kode / nama produk"
            value={search.get("search") ?? ""}
            onChange={(event) => {
              setSearch({
                ...param,
                page: "1",
                search: event.target.value,
              });
            }}
          />
        </div>
        <LoadingContainer loading={product.state.status == "loading"}>
          <div className="overflow-x-auto">
            <Table striped hoverable>
              <Table.Head>
                <Table.HeadCell>Kode</Table.HeadCell>
                <Table.HeadCell>Produk</Table.HeadCell>
                <Table.HeadCell>Catatan</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {(() => {
                  if (result?.data != null) {
                    const products = result.data;

                    if (products.length > 0) {
                      return (
                        <>
                          {products.map((e, i) => {
                            return (
                              <Table.Row key={i} className="text-nowrap">
                                <Table.Cell>{e.code}</Table.Cell>
                                <Table.Cell>{e.name}</Table.Cell>
                                <Table.Cell>{e.note}</Table.Cell>
                                <Table.Cell>
                                  <div className="flex gap-1">
                                    <Link
                                      to={`/app/product/edit/${e.id}`}
                                      state={{
                                        from:
                                          location.pathname + location.search,
                                      }}
                                      className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-600"
                                    >
                                      <HiPencil className="text-white" />
                                    </Link>
                                    <button
                                      className="p-2 rounded-full bg-red-600 hover:bg-red-700"
                                      onClick={() => {
                                        if (
                                          confirm(
                                            "Data akan dihapus, proses ini tidak dapat dikembalikan, lanjutkan?"
                                          )
                                        ) {
                                          product.remove(e.id, {
                                            token: auth.state.data!,
                                          });
                                        }
                                      }}
                                    >
                                      <HiTrash className="text-white" />
                                    </button>
                                  </div>
                                </Table.Cell>
                              </Table.Row>
                            );
                          })}
                        </>
                      );
                    }

                    return (
                      <Table.Row>
                        <Table.Cell
                          colSpan={4}
                          className="text-center bg-surface"
                        >
                          No data
                        </Table.Cell>
                      </Table.Row>
                    );
                  }

                  return (
                    <Table.Row>
                      <Table.Cell
                        colSpan={4}
                        className="text-center bg-surface"
                      >
                        Loading
                      </Table.Cell>
                    </Table.Row>
                  );
                })()}
              </Table.Body>
            </Table>
          </div>
        </LoadingContainer>
        {(() => {
          if (product.state.data != null) {
            return (
              <div className="w-full flex justify-center">
                <Pagination
                  layout="navigation"
                  currentPage={Number(search.get("page")!)}
                  totalPages={
                    result?.paging!.total! == 0
                      ? 1
                      : Math.ceil(
                          result?.paging!.total! / Number(search.get("limit")!)
                        )
                  }
                  onPageChange={(page) => {
                    setSearch({
                      ...param,
                      page: page.toString(),
                    });
                  }}
                />
              </div>
            );
          }

          return null;
        })()}
      </div>
    </>
  );
}
