// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import TableSkeleton from "@/components/shared/table-skeleton";
// import type { IArea } from "@/types";
// import { MapPin, Pencil, Trash2 } from "lucide-react";
// import { format } from "date-fns";

// interface Props {
//   areas: IArea[];
//   isLoading: boolean;
//   onEdit: (area: IArea) => void;
//   onDelete: (id: string) => void;
// }

// const headClass = "h-11 px-4 font-medium text-muted-foreground";
// const cellClass = "px-4 py-3";
// const iconButtonClass =
//   "size-10 rounded-full motion-safe:transition-colors focus-visible:ring-4 focus-visible:ring-primary/20";

// // The card in the page already provides the border and rounded corners,
// // so the table renders without its own outer wrapper.
// export default function AreasTable({ areas, isLoading, onEdit, onDelete }: Props) {
//   return (
//     <Table>
//       <TableHeader className="bg-muted/40">
//         <TableRow>
//           <TableHead className={headClass}>Name</TableHead>
//           <TableHead className={headClass}>District</TableHead>
//           <TableHead className={headClass}>City</TableHead>
//           <TableHead className={`${headClass} hidden md:table-cell`}>Created</TableHead>
//           <TableHead className={`${headClass} text-right`}>
//             <span className="sr-only">Actions</span>
//           </TableHead>
//         </TableRow>
//       </TableHeader>

//       {isLoading ? (
//         <TableSkeleton rows={5} cols={5} />
//       ) : areas.length === 0 ? (
//         <TableBody>
//           <TableRow>
//             <TableCell colSpan={5} className="px-4 py-12">
//               <div className="flex flex-col items-center gap-3 text-center">
//                 <span className="flex size-12 items-center justify-center rounded-full border bg-card">
//                   <MapPin className="size-5 text-muted-foreground" aria-hidden="true" />
//                 </span>
//                 <div>
//                   <p className="font-serif text-lg tracking-tight">No areas found</p>
//                   <p className="mt-1 text-sm text-muted-foreground">
//                     Try a different search, or add a new area.
//                   </p>
//                 </div>
//               </div>
//             </TableCell>
//           </TableRow>
//         </TableBody>
//       ) : (
//         <TableBody>
//           {areas.map((area) => (
//             <TableRow key={area.id}>
//               <TableCell className={`${cellClass} font-medium`}>{area.name}</TableCell>
//               <TableCell className={cellClass}>{area.district}</TableCell>
//               <TableCell className={cellClass}>{area.city}</TableCell>
//               <TableCell
//                 className={`${cellClass} hidden text-sm text-muted-foreground md:table-cell`}
//               >
//                 {area.createdAt ? format(new Date(area.createdAt), "dd MMM yyyy") : "—"}
//               </TableCell>
//               <TableCell className={cellClass}>
//                 <div className="flex items-center justify-end gap-1">
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     aria-label={`Edit ${area.name}`}
//                     className={`${iconButtonClass} hover:bg-primary/15`}
//                     onClick={() => onEdit(area)}
//                   >
//                     <Pencil className="size-4" aria-hidden="true" />
//                   </Button>

//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         aria-label={`Delete ${area.name}`}
//                         className={`${iconButtonClass} text-destructive hover:bg-destructive/10 hover:text-destructive`}
//                       >
//                         <Trash2 className="size-4" aria-hidden="true" />
//                       </Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent className="rounded-3xl p-5 sm:max-w-md sm:p-8">
//                       <AlertDialogHeader>
//                         <AlertDialogTitle className="font-serif text-xl tracking-tight">
//                           Delete area
//                         </AlertDialogTitle>
//                         <AlertDialogDescription>
//                           Are you sure you want to delete{" "}
//                           <span className="font-medium text-foreground">{area.name}</span>?
//                           This can't be undone.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter className="gap-2">
//                         <AlertDialogCancel className="h-11 rounded-full px-5">
//                           Cancel
//                         </AlertDialogCancel>
//                         <AlertDialogAction
//                           className="h-11 rounded-full bg-destructive px-5 text-white shadow-md shadow-destructive/30 hover:bg-destructive/90 motion-safe:transition-colors"
//                           onClick={() => onDelete(area.id)}
//                         >
//                           Delete area
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       )}
//     </Table>
//   );
// }