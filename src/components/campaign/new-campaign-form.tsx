// "use client";

// import {
//   Button,
//   Stack,
//   Card,
//   CardContent,
//   CardActions,
//   Box,
//   FormControl,
//   FormHelperText,
// } from "@mui/material";
// import LoadingButton from "@mui/lab/LoadingButton";

// import { FormInput } from "@/components/ui/form-input";
// import { AvatarUploader } from "@/components/ui/avatar-uploader";

// import { api } from "@/trpc/react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";
// import slugify from "slugify";

// import { useRouter } from "next/navigation";
// import { tokenList } from "@/config/tokens";
// import { SelectUser, Token } from "@/types";
// import Link from "next/link";
// import { Routes } from "@/config/routes";
// import { getDonationLink } from "@/utils/links";
// import { revalidateUser } from "@/app/actions/revalidate";
// import { FormTokenSelect } from "../ui/form-token-select";

// export const ProfileSchema = z.object({
//   avatar: z.string().trim().min(3, "Image is required").nullish(),
//   name: z
//     .string()
//     .trim()
//     .min(2, "Name is too short. Please enter at least 2 characters.")
//     .max(80, "Name exceeds the maximum length of 80 characters."),
//   slug: z
//     .string()
//     .trim()
//     .min(3, "Username is too short. Please enter at least 3 characters."),
//   bio: z
//     .string()
//     .trim()
//     .min(3, "Bio is too short. Please enter at least 3 characters.")
//     .nullish(),
//   acceptToken: z
//     .custom<Token>((value) => !!value, "This field is required.")
//     .nullish(),
//   thankMessage: z
//     .string()
//     .trim()
//     .min(3, "Thank message is too short. Please enter at least 3 characters.")
//     .nullish(),
// });

// export default function NewCampaignForm({ user }: { user: SelectUser }) {
//   const tprcUtils = api.useUtils();

//   const {
//     register,
//     handleSubmit,
//     control,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<z.infer<typeof ProfileSchema>>({
//     resolver: zodResolver(ProfileSchema),
//     defaultValues: {
//       avatar: user.avatar ?? "",
//       name: user.name ?? "",
//       slug: user.slug,
//       bio: user.bio,
//       acceptToken: user.acceptToken,
//       thankMessage: user.thankMessage,
//     },
//   });

//   const wSlug = watch("slug");

//   const router = useRouter();

//   const { mutate, isPending } = api.user.update.useMutation({
//     onSuccess: async (data) => {
//       if (data) {
//         await tprcUtils.user.getBySlug.invalidate({ slug: data.slug });
//       }
//       revalidateUser();

//       router.replace(Routes.ADMIN);
//     },
//     onError: (error) => {
//       console.error(error);
//     },
//   });

//   async function onSubmit(values: z.infer<typeof ProfileSchema>) {
//     try {
//       await mutate(values);
//     } catch (error: any) {
//       console.error(error);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Stack
//         width="100%"
//         flexDirection={{ xs: "column", md: "row" }}
//         alignItems="flex-start"
//         gap={3}
//       >
//         <FormControl error={!!errors.avatar} sx={{ flex: 1, width: "100%" }}>
//           <Controller
//             control={control}
//             name="avatar"
//             render={({ field }) => {
//               return (
//                 <Card>
//                   <CardContent>
//                     <AvatarUploader
//                       value={field.value}
//                       onChange={(file) => {
//                         field.onChange(file);
//                       }}
//                     />
//                   </CardContent>
//                 </Card>
//               );
//             }}
//           />
//           <FormHelperText sx={{ mt: 1 }}>
//             {errors.avatar?.message as string}
//           </FormHelperText>
//         </FormControl>

//         <Box
//           display="flex"
//           flexDirection="column"
//           gap={6}
//           sx={{ flex: { xs: 1, md: "2" }, width: "100%" }}
//         >
//           <Card>
//             <CardContent className="flex flex-col gap-5">
//               <FormInput
//                 {...register("slug")}
//                 fullWidth
//                 placeholder=""
//                 label="Username"
//                 error={!!errors.name}
//                 helperText={
//                   errors.name?.message
//                     ? errors.name?.message
//                     : wSlug
//                       ? getDonationLink(slugify(wSlug))
//                       : null
//                 }
//               />

//               <FormInput
//                 {...register("name")}
//                 fullWidth
//                 placeholder=""
//                 label="Full name"
//                 error={!!errors.name}
//                 helperText={errors.name?.message}
//               />

//               <FormInput
//                 {...register("bio")}
//                 fullWidth
//                 placeholder=""
//                 label="Bio"
//                 error={!!errors.bio}
//                 rows={5}
//                 multiline
//                 helperText={errors.bio?.message}
//               />
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="flex flex-col gap-5">
//               <Controller
//                 name="acceptToken"
//                 control={control}
//                 render={({ field }) => (
//                   <FormTokenSelect
//                     {...field}
//                     options={tokenList}
//                     label="Token"
//                     id="token"
//                     onChange={(_, data) => field.onChange(data)}
//                     error={!!errors.acceptToken}
//                     helperText={
//                       errors.acceptToken?.message as string | undefined
//                     }
//                   />
//                 )}
//               />

//               <FormInput
//                 {...register("thankMessage")}
//                 fullWidth
//                 placeholder=""
//                 label="Thank message"
//                 error={!!errors.thankMessage}
//                 rows={5}
//                 multiline
//                 helperText={errors.thankMessage?.message}
//               />
//             </CardContent>
//             <CardActions className="justify-end gap-4"></CardActions>
//           </Card>

//           <Stack flexDirection="row" gap={2} justifyContent="flex-end">
//             <Link href={Routes.ADMIN} replace>
//               <Button variant="outlined">Cancel</Button>
//             </Link>

//             <LoadingButton
//               loading={isSubmitting || isPending}
//               variant="contained"
//               type="submit"
//             >
//               Update
//             </LoadingButton>
//           </Stack>
//         </Box>
//       </Stack>
//     </form>
//   );
// }
