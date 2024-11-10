import { Pagination, Table, TextInput } from "flowbite-react";
import { useContext, useEffect } from "react";
import { HiPencil, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Repository } from "../../../App";
import {
  Product,
  ProductListParam,
} from "../../../feature/product/product_type";
import { LoadingContainer } from "../../component/LoadingContainer";
import { useProductHook } from "./ProductHook";

export function ProductList() {
  const { auth } = useContext(Repository)!;
  const product = useProductHook();
  const location = useLocation();

  const [search, setSearch] = useSearchParams({
    page: "1",
    limit: "10",
    search: "",
  });

  useEffect(() => {
    if (product.state.action == "idle" && product.state.status == "idle") {
      setSearch(search);
    }

    if (
      product.state.action == "remove" &&
      product.state.status == "complete"
    ) {
      const param = Object.fromEntries(search.entries()) as ProductListParam;
      product.list(param, auth.state.data!);

      if (product.state.error == null) {
        toast.success("Produk berhasil dihapus");
      } else {
        toast.error(product.state.error.message);
      }
    }
  }, [product.state]);

  useEffect(() => {
    if (location.state?.from == null) {
      const param = Object.fromEntries(search.entries()) as ProductListParam;
      product.list(param, auth.state.data!);
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
            className="bg-primary text-onprimary text-nowrap flex items-center p-2 px-3 rounded-lg"
          >
            <HiPlus className="mr-2 h-5 w-5" />
            <span>Tambah Produk</span>
          </Link>
          <TextInput
            icon={HiSearch}
            placeholder="Kode / nama produk"
            value={search.get("search") ?? ""}
            onChange={(event) => {
              const param = Object.fromEntries(search.entries());

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
                  if (product.state.data?.data != null) {
                    const products = product.state.data.data as Array<Product>;

                    if (products.length > 0) {
                      return (
                        <>
                          {products.map((e, i) => {
                            return (
                              <Table.Row key={i} className="text-nowrap">
                                <Table.Cell>{e.code}</Table.Cell>
                                <Table.Cell>{e.name}</Table.Cell>
                                <Table.Cell>{e.note ?? "-"}</Table.Cell>
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
                                          product.remove(
                                            e.id,
                                            auth.state.data!
                                          );
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
                  totalPages={Math.ceil(product.state.data.paging!.total! / 10)}
                  onPageChange={(page) => {
                    const param = Object.fromEntries(search.entries());

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
