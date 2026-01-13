"use client";

import { useState, useEffect } from "react";
import { Eye, Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { MaintenanceRequest } from "@/lib/db/schema";

const statusColors = {
  approved:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", // Diterima
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", // Diproses
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", //  Selesai
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", // Ditolak / Dibatalkan
};

interface RequestsManagementProps {
  role: string | undefined;
}

export function RequestsManagement({ role }: RequestsManagementProps) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] =
    useState<MaintenanceRequest | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [deletingRequest, setDeletingRequest] =
    useState<MaintenanceRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/maintenance-request");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        toast.error("Gagal memuat data permintaan");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Gagal memuat data permintaan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/maintenance-request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          `Status berhasil diperbarui menjadi ${getStatusLabel(newStatus)}`
        );
        fetchRequests();
      } else {
        toast.error(data.error || "Gagal memperbarui status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal memperbarui status");
    }
  };

  const handleDelete = async () => {
    if (!deletingRequest) return;

    try {
      const res = await fetch(
        `/api/maintenance-request/${deletingRequest.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setDeleteDialogOpen(false);
        setDeletingRequest(null);
        fetchRequests();
      } else {
        toast.error(data.error || "Gagal menghapus permintaan");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast.error("Gagal menghapus permintaan");
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      approved: "Diterima",
      in_progress: "Diproses",
      completed: "Selesai",
      cancelled: "Ditolak",
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return <div className="text-center py-4">Memuat data...</div>;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <Input placeholder="Cari alat..." className="w-full" />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pemohon</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Nama Alat</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                {role === "admin" && (
                  <TableHead className="text-right">Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.applicant_name}
                    </TableCell>
                    <TableCell>{request.unit}</TableCell>
                    <TableCell>{request.device_name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {request.damage_description}
                    </TableCell>
                    <TableCell>
                      {new Date(request.applicant_date).toLocaleDateString(
                        "id-ID"
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[
                            request.status as keyof typeof statusColors
                          ] || ""
                        }`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                    </TableCell>
                    {role === "admin" && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedRequest(request);
                              setDetailDialogOpen(true);
                            }}
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingRequest(request);
                              setNewStatus(request.status || "approved");
                              setEditStatusDialogOpen(true);
                            }}
                            title="Ubah Status"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setDeletingRequest(request);
                              setDeleteDialogOpen(true);
                            }}
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Permintaan Maintenance</DialogTitle>
            <DialogDescription>
              Informasi lengkap permintaan maintenance
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nama Pemohon
                  </p>
                  <p className="text-sm">{selectedRequest.applicant_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Unit/Ruangan
                  </p>
                  <p className="text-sm">{selectedRequest.unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nama Alat
                  </p>
                  <p className="text-sm">{selectedRequest.device_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tanggal Pengajuan
                  </p>
                  <p className="text-sm">
                    {new Date(
                      selectedRequest.applicant_date
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[
                          selectedRequest.status as keyof typeof statusColors
                        ] || ""
                      }`}
                    >
                      {getStatusLabel(selectedRequest.status)}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Deskripsi Kerusakan
                </p>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {selectedRequest.damage_description}
                </p>
              </div>
              {selectedRequest.photo_url && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Foto
                  </p>
                  <div className="relative w-full h-64">
                    <Image
                      src={selectedRequest.photo_url}
                      alt="Foto kerusakan"
                      fill
                      className="rounded-md border object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {/* Edit Status Dialog */}
      <Dialog
        open={editStatusDialogOpen}
        onOpenChange={setEditStatusDialogOpen}
      >
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Ubah Status</DialogTitle>
            <DialogDescription>
              Ubah status permintaan maintenance ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="col-span-3 w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Diterima</SelectItem>
                  <SelectItem value="in_progress">Diproses</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditStatusDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              onClick={async () => {
                if (editingRequest) {
                  await handleUpdateStatus(editingRequest.id, newStatus);
                  setEditStatusDialogOpen(false);
                }
              }}
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Permintaan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus permintaan dari{" "}
              <strong>{deletingRequest?.applicant_name}</strong>? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
