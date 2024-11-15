import dayjs from "dayjs";
import { Pagination, Table, TextInput } from "flowbite-react";
import { useContext, useEffect } from "react";
import { HiDownload, HiPencil, HiSearch, HiTrash } from "react-icons/hi";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Repository } from "../../../App";
import {
  Purchase,
  PurchaseListParam,
} from "../../../feature/purchase/purchase_type";
import { DateRangePicker } from "../../component/DateRangePicker";
import { LoadingContainer } from "../../component/LoadingContainer";
import { useInventoryHook } from "./InventoryHook";

export function InventoryList() {
  const { auth } = useContext(Repository)!;
  const inventory = useInventoryHook();
  const location = useLocation();

  const [search, setSearch] = useSearchParams({
    page: "1",
    limit: "10",
    search: "",
    start: dayjs().format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  });

  const param = Object.fromEntries(search.entries());

  useEffect(() => {
    if (inventory.state.status == "complete" && inventory.state.error != null) {
      inventory.list(param as PurchaseListParam, auth.state.data!);
      toast.error(inventory.state.error.message);
    }

    if (
      inventory.state.action == "remove" &&
      inventory.state.status == "complete" &&
      inventory.state.error == null
    ) {
      inventory.list(param as PurchaseListParam, auth.state.data!);
      toast.success("Data berhasil dihapus");
    }
  }, [inventory.state]);

  useEffect(() => {
    if (search.size == 5) {
      inventory.list(param as PurchaseListParam, auth.state.data!);
    }
  }, [search]);

  return (
    <>
      <div className="bg-container rounded p-4 min-h-screen flex flex-col gap-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between">
          <Link
            to="/app/inventory/create"
            state={{
              from: location.pathname + location.search,
            }}
            className="bg-primary text-onprimary text-nowrap flex items-center p-2 px-3 rounded-md"
          >
            <HiDownload className="mr-2 h-5 w-5" />
            <span>Barang Masuk</span>
          </Link>
          <div className="flex gap-2 items-center">
            <DateRangePicker
              onChange={(date) => {
                const start = dayjs(date.start).format("YYYY-MM-DD");
                const end = dayjs(date.end).format("YYYY-MM-DD");

                setSearch({
                  ...param,
                  start: start,
                  end: end,
                  search: "",
                });
              }}
            />
            <TextInput
              icon={HiSearch}
              placeholder="Kode / nama supplier"
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
        </div>
        <LoadingContainer loading={inventory.state.status == "loading"}>
          <div className="overflow-x-auto">
            <Table striped hoverable>
              <Table.Head>
                <Table.HeadCell>Kode</Table.HeadCell>
                <Table.HeadCell>Supplier</Table.HeadCell>
                <Table.HeadCell>Total</Table.HeadCell>
                <Table.HeadCell>Fee %</Table.HeadCell>
                <Table.HeadCell>Biaya</Table.HeadCell>
                <Table.HeadCell>Bayar</Table.HeadCell>
                <Table.HeadCell>Hutang</Table.HeadCell>
                <Table.HeadCell>Tanggal</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {(() => {
                  if (inventory.state.data?.data != null) {
                    const inventories = inventory.state.data
                      .data as Array<Purchase>;

                    if (inventories.length > 0) {
                      return (
                        <>
                          {inventories.map((e, i) => {
                            return (
                              <Table.Row key={i} className="text-nowrap">
                                <Table.Cell>{e.code}</Table.Cell>
                                <Table.Cell>{e.supplierName}</Table.Cell>
                                <Table.Cell>Rp {e.total}</Table.Cell>
                                <Table.Cell>Rp {e.fee}</Table.Cell>
                                <Table.Cell>Rp {e.other}</Table.Cell>
                                <Table.Cell>Rp {e.paid}</Table.Cell>
                                <Table.Cell>Rp {e.balance}</Table.Cell>
                                <Table.Cell>
                                  {dayjs(e.created).format("DD-MM-YYYY")}
                                </Table.Cell>
                                <Table.Cell>
                                  <div className="flex gap-1">
                                    <Link
                                      to={`/app/inventory/edit/${e.id}`}
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
                                          //
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
                          colSpan={9}
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
                        colSpan={9}
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
        <div className="w-full flex justify-center">
          <Pagination
            layout="navigation"
            currentPage={Number(search.get("page")!)}
            totalPages={
              inventory.state.data?.paging!.total! == 0
                ? 1
                : Math.ceil(
                    inventory.state.data?.paging!.total! /
                      Number(search.get("limit")!)
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
      </div>
    </>
  );
}
