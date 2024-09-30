"use client";

import {
  Button,
  Stack,
  Card,
  CardContent,
  Box,
  FormControl,
  FormHelperText,
  CardHeader,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { FormInput, FormNumberInput } from "@/components/ui/form-input";
import { AvatarUploader } from "@/components/ui/avatar-uploader";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, get, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { SelectUser } from "@/types";
import { isPublicKey } from "@/utils/keypair";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import CreateDispenserConfirmDialog from "./confirm-dialog";
import { openSnackbar } from "../ui/snackbar";
import { uploadObject } from "@/app/actions/upload";
import { api } from "@/trpc/react";
import { Routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { createSOLTiplink } from "@/lib/tiplink";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "../connect-wallet";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const newNftSchema = z.object({
  media: z.any().refine((file) => !!file, "Media is required."),
  name: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(32, `The maximum allowed length for this field is 32 characters`),
  symbol: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(10, `The maximum allowed length for this field is 10 characters`),
  description: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(200, `The maximum allowed length for this field is 200 characters`),
  externalUrl: z
    .string()
    .trim()
    .max(256, `The maximum allowed length for this field is 256 characters`)
    .optional(),
  royalty: z.coerce
    .number({
      required_error: "This field is required.",
      invalid_type_error: "This field is required.",
    })
    .min(0, "The royalty must be greater than or equal to 0.")
    .max(100, "The royalty must not exceed 100."),
  isCollection: z.boolean(),
  creators: z
    .array(
      z.object({
        address: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(44, `The maximum allowed length for this field is 44 characters`)
          .refine((val) => isPublicKey(val), {
            message: "Invalid wallet",
          }),
        share: z.coerce
          .number({ required_error: "This field is required." })
          .min(0, "The share must be greater than or equal to 0.")
          .max(100, "The share must not exceed 100."),
      }),
    )
    .optional()
    .superRefine((values, ctx) => {
      if (values) {
        const hasInvalidWallet = values.some(
          (val) => !isPublicKey(val.address),
        );
        if (hasInvalidWallet) {
          values.forEach((val, idx) => {
            if (!isPublicKey(val.address)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Invalid wallet address`,
                path: [idx, "wallet"],
              });
            }
          });
          return;
        }

        const wallets = values.map((val) => val.address);
        const uniqueWallets = Array.from(
          new Set(values.map((val) => val.address)),
        );

        if (uniqueWallets.length < wallets.length) {
          const uniqueWalletsArr: string[] = [];
          values.forEach((value, index) => {
            if (uniqueWalletsArr.includes(value.address)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `All addresses must be unique`,
                path: [index, "wallet"],
              });
            } else {
              uniqueWalletsArr.push(value.address);
            }
          });

          return;
        }

        const totalShare = values.reduce((prev, cur) => prev + cur.share, 0);
        if (totalShare > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Part of the royalties remained undivided. You must distribute all 100%`,
            path: [values.length - 1, "share"],
          });
        }
      }
    }),

  properties: z
    .array(
      z.object({
        name: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(
            10,
            `The maximum allowed length for this field is 10 characters`,
          ),
        value: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(
            32,
            `The maximum allowed length for this field is 32 characters`,
          ),
      }),
    )
    .optional(),

  numOfNFT: z.coerce
    .number({
      required_error: "This field is required.",
      invalid_type_error: "This field is required.",
    })
    .gt(0, "Number of NFT must be greater than 0.")
    .max(10000, "Number of NFT must not exceed 100."),
});

export default function NewDispenserForm({ user }: { user: SelectUser }) {
  const router = useRouter();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [openConfirm, setOpenConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof newNftSchema>>({
    resolver: zodResolver(newNftSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      externalUrl: "",
      royalty: 10,
      isCollection: false,
      creators: [{ address: "", share: 100 }],
      properties: [{ name: "", value: "" }],
      numOfNFT: 100,
    },
  });

  const {
    fields: creatorFields,
    append: appendCreator,
    remove: removeCreator,
  } = useFieldArray({
    control: control,
    name: "creators",
  });

  const {
    fields: attributeFields,
    append: appendAttr,
    remove: removeAttr,
  } = useFieldArray({
    control,
    name: "properties",
  });

  const wCreators = watch("creators");
  const wProperties = watch("properties");

  const { mutate, isPending } = api.nftDispenser.create.useMutation({
    onSuccess: async (_data) => {
      openSnackbar({
        title: "success",
        severity: "success",
      });
      router.replace(Routes.ADMIN_NFT_DISPENSER);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function onSubmit(values: z.infer<typeof newNftSchema>) {
    try {
      if (!publicKey) {
        return;
      }

      const amount = values.numOfNFT * 0.001 * LAMPORTS_PER_SOL;

      const { tiplink, transaction } = await createSOLTiplink(
        publicKey,
        amount,
      );

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "confirmed");

      await mutate({
        ...values,
        link: tiplink.url.toString(),
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  async function demo() {
    try {
      const object = {
        name: "Khac Vy",
        age: 31,
      };

      const res = await uploadObject("test-file.json", object);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          width="100%"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="flex-start"
          gap={3}
        >
          <FormControl error={!!errors.media} sx={{ flex: 1, width: "100%" }}>
            <Controller
              control={control}
              name="media"
              render={({ field }) => {
                return (
                  <Card>
                    <CardContent>
                      <AvatarUploader
                        value={field.value}
                        onChange={(file) => {
                          field.onChange(file);
                        }}
                      />
                    </CardContent>
                  </Card>
                );
              }}
            />
            <FormHelperText sx={{ mt: 1 }}>
              {errors.media?.message as string}
            </FormHelperText>
          </FormControl>

          <Box
            display="flex"
            flexDirection="column"
            gap={6}
            sx={{ flex: { xs: 1, md: "2" }, width: "100%" }}
          >
            <Card>
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              >
                <FormInput
                  {...register("name")}
                  fullWidth
                  placeholder=""
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <FormInput
                  {...register("symbol")}
                  fullWidth
                  placeholder=""
                  label="Symbol"
                  error={!!errors.symbol}
                  helperText={errors.symbol?.message}
                />

                <FormInput
                  {...register("description")}
                  fullWidth
                  placeholder=""
                  label="Description"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />

                <FormInput
                  {...register("externalUrl")}
                  fullWidth
                  placeholder=""
                  label="External URL"
                  error={!!errors.externalUrl}
                  helperText={errors.externalUrl?.message}
                />

                <FormControl fullWidth error={!!errors.isCollection}>
                  <InputLabel id="is-collection-label">Is Collection</InputLabel>
                  <Controller
                    control={control}
                    name="isCollection"
                    defaultValue={false}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="is-collection-label"
                        label="Is Collection"
                        onChange={(event) => {
                          field.onChange(event.target.value === "true"); // Chuyển đổi giá trị sang boolean
                        }}
                        value={field.value ? "true" : "false"}
                      >
                        <MenuItem value="true">True</MenuItem>
                        <MenuItem value="false">False</MenuItem>
                      </Select>
                    )}
                  />
                  <FormHelperText>{errors.isCollection?.message}</FormHelperText>
                </FormControl>

                <Controller
                  control={control}
                  name="royalty"
                  render={({ field }) => (
                    <FormNumberInput
                      {...field}
                      fullWidth
                      placeholder=""
                      allowNegative={false}
                      min={0}
                      label="Royalty"
                      error={!!errors.royalty}
                      helperText={
                        (errors.royalty?.message as string | null) ??
                        "The percentage of future sales that will be sent to the creators of this NFT."
                      }
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Creators" />
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {creatorFields.map((field, index) => (
                  <Stack key={field.id} gap={2} justifyContent="flex-end">
                    <Stack direction="row" alignItems="flex-start" gap={2}>
                      <Box flexBasis={`66%`}>
                        <FormInput
                          {...register(`creators.${index}.address`)}
                          fullWidth
                          placeholder=""
                          label="Wallet"
                          error={!!get(errors, `creators.${index}.address`)}
                          helperText={
                            get(errors, `creators.${index}.address`)?.message
                          }
                        />
                      </Box>

                      <Box flexBasis={`34%`}>
                        <Controller
                          control={control}
                          name={`creators.${index}.share`}
                          render={({ field }) => (
                            <FormNumberInput
                              {...field}
                              fullWidth
                              placeholder=""
                              allowNegative={false}
                              min={0}
                              label="Share"
                              error={!!get(errors, `creators.${index}.share`)}
                              helperText={
                                get(errors, `creators.${index}.share`)?.message
                              }
                            />
                          )}
                        />
                      </Box>
                    </Stack>

                    {index > 0 && (
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          removeCreator(index);
                        }}
                        sx={{
                          flexShrink: 0,
                          alignSelf: "flex-end",
                        }}
                        variant="text"
                        size="small"
                        disabled={index === 0}
                        startIcon={<Trash2Icon />}
                        color="error"
                      >
                        Remove
                      </Button>
                    )}
                  </Stack>
                ))}
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    appendCreator({ address: "", share: 0 });
                  }}
                  size="small"
                  startIcon={<PlusIcon />}
                  disabled={wCreators && wCreators.length === 4}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Add creator
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Properties" />
              <CardContent
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {attributeFields.map((field, index) => (
                  <Stack key={field.id} gap={2} justifyContent="flex-end">
                    <Stack direction="row" alignItems="flex-start" gap={2}>
                      <Box flexBasis="50%">
                        <FormInput
                          {...register(`properties.${index}.name`)}
                          fullWidth
                          placeholder=""
                          label="Name"
                          error={!!get(errors, `properties.${index}.name`)}
                          helperText={
                            get(errors, `properties.${index}.name`)?.message
                          }
                        />
                      </Box>

                      <Box flexBasis="50%">
                        <FormInput
                          {...register(`properties.${index}.value`)}
                          fullWidth
                          placeholder=""
                          label="Value"
                          error={!!get(errors, `properties.${index}.value`)}
                          helperText={
                            get(errors, `properties.${index}.value`)?.message
                          }
                        />
                      </Box>
                    </Stack>

                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        removeAttr(index);
                      }}
                      sx={{
                        flexShrink: 0,
                        alignSelf: "flex-end",
                      }}
                      variant="text"
                      size="small"
                      startIcon={<Trash2Icon />}
                      color="error"
                    >
                      Remove
                    </Button>
                  </Stack>
                ))}
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    appendAttr({ name: "", value: "" });
                  }}
                  sx={{ alignSelf: "flex-start" }}
                  size="small"
                  startIcon={<PlusIcon />}
                  disabled={wProperties && wProperties.length === 10}
                >
                  Add property
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Dispenser" />
              <CardContent>
                <Controller
                  control={control}
                  name="numOfNFT"
                  render={({ field }) => (
                    <FormNumberInput
                      {...field}
                      fullWidth
                      placeholder=""
                      allowNegative={false}
                      min={0}
                      label="Number of NFT"
                      error={!!errors.numOfNFT}
                      helperText={
                        (errors.numOfNFT?.message as string | null) ?? ""
                      }
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Stack flexDirection="row" gap={2} justifyContent="flex-end">
              {/* <Link href={Routes.ADMIN} replace> */}
              <Button onClick={demo} variant="outlined">
                Cancel
              </Button>
              {/* </Link> */}

              {publicKey ? (
                <LoadingButton
                  loading={isSubmitting || isPending}
                  variant="contained"
                  type="submit"
                >
                  Create
                </LoadingButton>
              ) : (
                <ConnectWalletButton />
              )}
            </Stack>
          </Box>
        </Stack>
        <CreateDispenserConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
        />
      </form>
    </>
  );
}
