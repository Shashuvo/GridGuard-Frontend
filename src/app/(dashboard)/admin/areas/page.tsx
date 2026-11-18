// "use client";

// import { useGetAllAreas, useCreateArea, useUpdateArea, useDeleteArea } from "@/hooks";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import TablePagination from "@/components/ui/table-pagination";
// import AreasTable from "@/components/modules/admin/areas-table";
// import AreaForm from "@/components/form/area-form";
// import type { IArea } from "@/types";
// import { getErrorMessage } from "@/lib/getErrorMessage";
// import { useQueryClient } from "@tanstack/react-query";
// import { Plus, Search } from "lucide-react";

// const dialogClass = "rounded-3xl p-5 sm:max-w-md sm:p-8";
// const dialogTitleClass = "font-serif text-xl tracking-tight";

// export default function AreasPage() {
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [editArea, setEditArea] = useState<IArea | null>(null);

//   const queryClient = useQueryClient();

//   const { data, isLoading } = useGetAllAreas({
//     page,
//     limit: 10,
//     search: search || undefined,
//   });

//   const { mutate: createArea, isPending: createPending } = useCreateArea();
//   const { mutate: updateArea, isPending: updatePending } = useUpdateArea();
//   const { mutate: deleteArea } = useDeleteArea();

//   const areas = (data?.data ?? []) as IArea[];
//   const meta = data?.meta;

//   const refresh = () => {
//     queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
//     queryClient.invalidateQueries({ queryKey: ["areas"] });
//   };

//   const handleCreate = (value: { name: string; district: string; city: string }) => {
//     createArea(value, {
//       onSuccess: () => {
//         refresh();
//         toast.add({ title: "Area added", description: "The new area is now available.", type: "success" });
//         setIsCreateOpen(false);
//       },
//       onError: (err) => {
//         toast.add({ title: "Couldn't add area", description: getErrorMessage(err), type: "error" });
//       },
//     });
//   };

//   const handleUpdate = (value: { name: string; district: string; city: string }) => {
//     if (!editArea) return;
//     updateArea(
//       { id: editArea.id, payload: value },
//       {
//         onSuccess: () => {
//           refresh();
//           toast.add({ title: "Area updated", description: "Your changes have been saved.", type: "success" });
//           setEditArea(null);
//         },
//         onError: (err) => {
//           toast.add({ title: "Couldn't update area", description: getErrorMessage(err), type: "error" });
//         },
//       }
//     );
//   };

//   const handleDelete = (id: string) => {
//     deleteArea(id, {
//       onSuccess: () => {
//         refresh();
//         toast.add({ title: "Area deleted", description: "The area has been removed.", type: "success" });
//       },
//       onError: (err) => {
//         toast.add({ title: "Couldn't delete area", description: getErrorMessage(err), type: "error" });
//       },
//     });
//   };

//   return (
//     <div className="relative isolate overflow-hidden p-4 sm:p-6 md:p-8">
//       {/* Neutral background glow */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:size-96"
//       />

//       <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-6">
//         {/* Header */}
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <h1 className="font-serif text-3xl tracking-tight">Areas</h1>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Manage the areas GridGuard covers.
//             </p>
//           </div>
//           <Button
//             onClick={() => setIsCreateOpen(true)}
//             className="h-11 w-full rounded-full px-5 shadow-md shadow-primary/30 sm:w-auto motion-safe:transition-colors"
//           >
//             <Plus className="size-4" aria-hidden="true" />
//             Add area
//           </Button>
//         </div>

//         {/* Main panel */}
//         <div className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-reduce:animate-none sm:p-6">
//           {/* Search */}
//           <div className="relative w-full sm:max-w-xs">
//             <Search
//               className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
//               aria-hidden="true"
//             />
//             <Input
//               type="search"
//               aria-label="Search areas"
//               placeholder="Search areas"
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               className="h-11 rounded-full bg-background pl-10 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
//             />
//           </div>

//           {/* Table (scrolls inside its own container on small screens) */}
//           <div className="overflow-x-auto rounded-2xl border bg-background">
//             <AreasTable
//               areas={areas}
//               isLoading={isLoading}
//               onEdit={(area) => setEditArea(area)}
//               onDelete={handleDelete}
//             />
//           </div>

//           {meta && meta.totalPages > 1 && (
//             <div className="flex justify-center sm:justify-end">
//               <TablePagination
//                 totalPages={meta.totalPages}
//                 page={page}
//                 handlePageChange={setPage}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add dialog */}
//       <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
//         <DialogContent className={dialogClass}>
//           <DialogHeader>
//             <DialogTitle className={dialogTitleClass}>Add area</DialogTitle>
//           </DialogHeader>
//           <AreaForm onSubmit={handleCreate} isPending={createPending} />
//         </DialogContent>
//       </Dialog>

//       {/* Edit dialog */}
//       <Dialog open={!!editArea} onOpenChange={(open) => !open && setEditArea(null)}>
//         <DialogContent className={dialogClass}>
//           <DialogHeader>
//             <DialogTitle className={dialogTitleClass}>Edit area</DialogTitle>
//           </DialogHeader>
//           {editArea && (
//             <AreaForm
//               area={editArea}
//               onSubmit={handleUpdate}
//               isPending={updatePending}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }