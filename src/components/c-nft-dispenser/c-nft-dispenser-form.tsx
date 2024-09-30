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
  Typography,
  FormControlLabel,
  Checkbox,
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
import { getConnection } from "@/lib/transactions";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createTree, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";

const newCNftSchema = z.object({
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
  max_depth: z.coerce
    .number({
      required_error: "This field is required.",
      invalid_type_error: "This field is required.",
    })
    .min(0, "The royalty must be greater than or equal to 0.")
    .max(100, "The royalty must not exceed 100."),
  max_buffer_size: z.coerce
    .number({
      required_error: "This field is required.",
      invalid_type_error: "This field is required.",
    })
    .min(0, "The royalty must be greater than or equal to 0.")
    .max(100, "The royalty must not exceed 100."),
  canopy_depth: z.coerce
    .number({
      required_error: "This field is required.",
      invalid_type_error: "This field is required.",
    })
    .min(0, "The royalty must be greater than or equal to 0.")
    .max(100, "The royalty must not exceed 100."),
  useCollection: z.boolean().default(false),
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

  numOfCNFT: z.coerce
    .number({
      required_error: "This field is required.",
      invalid_type_error: "This field is required.",
    })
    .gt(0, "Number of CNFT must be greater than 0.")
    .max(10000, "Number of CNFT must not exceed 100."),
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
  } = useForm<z.infer<typeof newCNftSchema>>({
    resolver: zodResolver(newCNftSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      externalUrl: "",
      royalty: 10,
      max_depth: 5,
      max_buffer_size: 8,
      canopy_depth: 2,
      useCollection: false,
      creators: [{ address: "", share: 100 }],
      properties: [{ name: "", value: "" }],
      numOfCNFT: 100,
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

  const { mutate, isPending } = api.cnftDispenser.create.useMutation({
    onSuccess: async (_data) => {
      openSnackbar({
        title: "success",
        severity: "success",
      });
      router.replace(Routes.ADMIN_C_NFT_DISPENSER);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function onSubmit(values: z.infer<typeof newCNftSchema>) {
    try {
      if (!publicKey) {
        openSnackbar({
          title: "Please connect your wallet",
          severity: "error",
        });
        return;
      }

      const amount = values.numOfCNFT * 0.005 * LAMPORTS_PER_SOL;

      const { tiplink, transaction } = await createSOLTiplink(
        publicKey,
        amount,
      );

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "confirmed");

      const connectionRPC = getConnection();
      const umi = createUmi(connectionRPC)
        .use(mplTokenMetadata())
        .use(mplBubblegum())
        .use(keypairIdentity(fromWeb3JsKeypair(tiplink.keypair)));

      const createMerkleTree = async () => {
        try {
          const merkleTree = generateSigner(umi);
          const builders = await createTree(umi, {
            merkleTree,
            maxDepth: values.max_depth,
            maxBufferSize: values.max_buffer_size,
            canopyDepth: values.canopy_depth
          });
          await builders.sendAndConfirm(umi);
          return merkleTree.publicKey.toString();
        } catch (error) {
          console.error("Error when creating a Merkle tree:", error);
          throw new Error("Unable to create a Merkle tree");
        }
      };

      const createCollectionNft = async () => {
        try {
          const collectionMint = generateSigner(umi);
          await createNft(umi, {
            mint: collectionMint,
            name: values.name ?? '',
            uri: values.externalUrl ? '' : '',
            sellerFeeBasisPoints: percentAmount(parseFloat(values.royalty.toString())),
            tokenOwner: fromWeb3JsPublicKey(publicKey),
            isCollection: true,
          }).sendAndConfirm(umi);
          return collectionMint.publicKey.toString();
        } catch (error) {
          console.error("Errors when creating NFT Collections:", error);
          throw new Error("Unable to create NFT Collections");
        }
      };

      let merkleTreePublicKey: string;
      try {
        merkleTreePublicKey = await createMerkleTree();
      } catch (error) {
        openSnackbar({
          title: "Error when creating a Merkle tree",
          severity: "error",
        });
        return;
      }

      if (!merkleTreePublicKey) {
        openSnackbar({
          title: "Unable to create a Merkle tree",
          severity: "error",
        });
        return;
      }

      let collectionMintPublicKeys: string | undefined;
      if (values.useCollection) {
        try {
          collectionMintPublicKeys = await createCollectionNft();
        } catch (error) {
          openSnackbar({
            title: "Errors when creating NFT Collections",
            severity: "error",
          });
          return;
        }
      }

      const mutateData = {
        ...values,
        link: tiplink.url.toString(),
        merkleTreePublicKey,
        collectionMintPublicKeys,
      };

      await mutate(mutateData);

      openSnackbar({
        title: "CNFT dispenser has been successfully made",
        severity: "success",
      });
    } catch (error: any) {
      console.error("Errors when creating CNFT dispensers:", error);
      openSnackbar({
        title: "Error creating a CNFT dispenser",
        severity: "error",
      });
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
                        "The percentage of future sales that will be sent to the creators of this CNFT."
                      }
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Merkle Tree Settings" />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Please fill in the following information to create a Merkle Tree
                </Typography>
                
                <FormInput
                  {...register("max_depth")}
                  fullWidth
                  placeholder=""
                  label="Maximum Depth"
                  error={!!errors.max_depth}
                  helperText={errors.max_depth?.message}
                />
                
                <FormInput
                  {...register("max_buffer_size")}
                  fullWidth
                  placeholder=""
                  label="Maximum Buffer Size"
                  error={!!errors.max_buffer_size}
                  helperText={errors.max_buffer_size?.message}
                />
                
                <FormInput
                  {...register("canopy_depth")}
                  fullWidth
                  placeholder=""
                  label="Canopy Depth"
                  error={!!errors.canopy_depth}
                  helperText={errors.canopy_depth?.message}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Controller
                        name="useCollection"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label="Mint with Collection"
                    style={{ fontWeight: 'bold' }}
                  />
                  {errors.useCollection && (
                    <FormHelperText error>{errors.useCollection.message}</FormHelperText>
                  )}
                </FormControl>
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
                  name="numOfCNFT"
                  render={({ field }) => (
                    <FormNumberInput
                      {...field}
                      fullWidth
                      placeholder=""
                      allowNegative={false}
                      min={0}
                      label="Number of CNFT"
                      error={!!errors.numOfCNFT}
                      helperText={
                        (errors.numOfCNFT?.message as string | null) ?? ""
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