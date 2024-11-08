import { Button, Pagination, Table, TextInput } from "flowbite-react";
import { useContext, useEffect } from "react";
import { HiPencil, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { Repository } from "../../../App";
import {
  Product,
  ProductListParam,
  productListSchema,
} from "../../../feature/product/product_type";
import { LoadingContainer } from "../../component/LoadingContainer";
import { useProductHook } from "./ProductHook";

export function ProductPage() {
  const { auth } = useContext(Repository)!;
  const product = useProductHook();

  const [search, setSearch] = useSearchParams({
    page: "1",
    limit: "10",
    search: "",
  });

  useEffect(() => {
    if (product.state.action == "idle" && product.state.status == "idle") {
      setSearch(createSearchParams(search));

      productListSchema
        .validate(Object.fromEntries(search.entries()))
        .then((param) => {
          product.list(param, auth.state.data!);
        });
    }
  }, [product.state, search]);

  return (
    <>
      <div className="bg-container rounded p-4 min-h-screen flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
          <Button className="bg-primary text-onprimary text-nowrap">
            <HiPlus className="mr-2 h-5 w-5" />
            <span>Tambah Produk</span>
          </Button>
          <TextInput
            icon={HiSearch}
            placeholder="Kode / nama produk"
            value={search.get("search") ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              const oldParam = Object.fromEntries(search.entries());
              const newParam = { ...oldParam, search: value, page: 1 };

              setSearch(
                createSearchParams({
                  ...newParam,
                  page: newParam.page.toString(),
                })
              );

              product.list(newParam as ProductListParam, auth.state.data!);
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
                    const oldParam = Object.fromEntries(search.entries());
                    const newParam = { ...oldParam, page: page };

                    setSearch(
                      createSearchParams({
                        ...newParam,
                        page: newParam.page.toString(),
                      })
                    );

                    product.list(
                      newParam as ProductListParam,
                      auth.state.data!
                    );
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
