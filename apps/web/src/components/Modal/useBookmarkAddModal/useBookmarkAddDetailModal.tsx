import { css } from "@emotion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Form from "@radix-ui/react-form";
import { Box, Dialog, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import useACToast from "@arcave/components/ACToast/useACToast";
import { BaseButton } from "@arcave/components/common/button";
import { HStack } from "@arcave/components/common/Stack/HStack";
import { VStack } from "@arcave/components/common/Stack/VStack";
import ACSelect from "@arcave/components/Select";
import { GROUP_VALUE } from "@arcave/components/Select/types";
import { BookmarkTab } from "@arcave/pages/mycave";
import useAPILink from "@arcave/services/external/useAPILink";
import useAPIScrape from "@arcave/services/internal/useAPIScrape";
import BookmarkTabAtom from "@arcave/store/BookmarkTabAtom";
import LinkModalAtom, { LinkModel } from "@arcave/store/LinkModalAtom";
import { PaletteColor, SemanticColor } from "@arcave/utils/color";

import useUploadImage from "../common/useUploadImage";

const schema = z
  .object({
    linkName: z
      .string()
      .min(1, "북마크는 필수 입력입니다.")
      .max(100, "북마크 이름은 최대 100자까지 입력할 수 있습니다."),
    linkDesc: z
      .string()
      .max(400, "북마크 설명은 최대 400자까지 입력할 수 있습니다."),
  })
  .required();

const useBookmarkAddDetailModal = ({ handleOpenGroupAddModal }) => {
  const [linkDto, setLinkDto] = useAtom(LinkModalAtom);

  const imgRef = useRef<HTMLImageElement>(null);

  const [isFetched, setIsFetched] = useState(false);
  const [open, setOpen] = useState(false);

  const [, setBookmarkTabValue] = useAtom(BookmarkTabAtom);

  const {
    previewImageUrl,
    fileImageBlob,
    fileInputRef,
    handleChangePreviewImageUrl,
    handleChangeFileInput,
    resetUploadField,
  } = useUploadImage();
  const { executePost: executePostLink, executePatch: executePatchLink } =
    useAPILink({
      linkDto: linkDto as LinkModel,
      fileImageBlob,
      previewImageExtension: previewImageUrl.split(".").at(-1) as string,
    });

  const { executeFetch: executeFetchScrape } = useAPIScrape(linkDto?.linkUrl);

  const toast = useACToast();

  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const watchLinkDesc = watch("linkDesc");

  const handleChangeOpen = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  const resetModal = () => {
    resetUploadField();
    reset();
    setLinkDto({});
    setIsFetched(false);
  };

  const handleClickUploadPanel = () => {
    fileInputRef.current?.click();
  };

  const submit = async () => {
    try {
      if (!!linkDto?.linkId) {
        await executePatchLink(linkDto);
        return;
      }

      await executePostLink({ ...linkDto, ...getValues() }, imgRef.current);
      toast.show({
        title: "링크를 케이브에 담았습니다! 다른 취향도 찾아보세요!",
      });
    } catch (e) {
      console.error(e);
      toast.show({ title: "오류가 발생했습니다" });
    } finally {
      resetModal();
    }
  };

  const handleClickAddGroup = () => {
    resetModal();
    setBookmarkTabValue(BookmarkTab.GROUP);
    handleOpenGroupAddModal();
  };

  const handleShow = (params) => {
    if (params) {
      const { linkId, linkName, linkDesc, groupId, linkUrl } = params;
      setLinkDto({
        linkId,
        linkName,
        linkDesc,
        linkUrl,
        ...(groupId ? { groupId } : {}),
      });
    }
    handleChangeOpen(true);
    setIsFetched(true);
  };

  useEffect(() => {
    (async () => {
      if (!!linkDto?.linkUrl) {
        try {
          const { title, ogDescription, ogImage } = await executeFetchScrape();
          setLinkDto({ ...linkDto, linkName: title, linkDesc: ogDescription });
          setValue("linkName", title, { shouldValidate: true });
          setValue("linkDesc", ogDescription, { shouldValidate: true });
          if (ogImage) {
            handleChangePreviewImageUrl(ogImage);
          }

          setIsFetched(true);
        } catch (e) {
          window.alert("해당 링크의 메타정보를 가져올 수 없습니다");
          return;
        }
      }
    })();
  }, [linkDto?.linkUrl]);

  return {
    show: handleShow,
    close: () => {
      resetModal();
    },
    render: isFetched
      ? () => (
          <>
            <Dialog.Root open={open} onOpenChange={handleChangeOpen}>
              <Dialog.Content style={{ maxWidth: 450 }}>
                <Dialog.Title>링크 담기</Dialog.Title>
                <Form.Root className="FormRoot">
                  <VStack gap="6">
                    {previewImageUrl ? (
                      <img
                        ref={imgRef}
                        src={previewImageUrl}
                        onClick={handleClickUploadPanel}
                        onError={resetUploadField}
                      />
                    ) : (
                      <Box
                        width={"100%"}
                        className="h-52 rounded-lg"
                        css={css`
                          background-color: ${PaletteColor.Gray[300]};
                          :hover {
                            cursor: pointer;
                          }
                        `}
                        onClick={handleClickUploadPanel}
                      />
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/gif,image/jpeg,image/jpg,image/png"
                      name="linkImgFile"
                      hidden
                      onChange={handleChangeFileInput}
                    />
                    <VStack gap="4">
                      <Flex direction="column" gap="3">
                        <HStack width={"100%"} justify={"between"}>
                          <Text>그룹</Text>
                          <Text
                            onClick={handleClickAddGroup}
                            css={css`
                              cursor: pointer;
                            `}
                          >
                            그룹 추가하기 {">"}
                          </Text>
                        </HStack>
                        <Form.Field className="FormField" name="group">
                          <ACSelect // FIXME: rhf으로 전환 예정
                            onChange={(value: string): void => {
                              setLinkDto((prevLinkDto) => ({
                                ...prevLinkDto,
                                ...(value !== GROUP_VALUE.UNDESIGNATED && {
                                  groupId: value,
                                }),
                                // groupId: [
                                //   ...(value !== GROUP_VALUE.UNDESIGNATED
                                //     ? [value]
                                //     : []),
                                // ],
                              }));
                            }}
                          />
                        </Form.Field>
                      </Flex>
                      <Flex direction="column" gap="3">
                        <Text>링크 이름</Text>
                        {/* linkDto.linkName */}
                        <TextField.Input
                          size="3"
                          placeholder="링크 이름을 입력해주세요"
                          {...register("linkName")}
                        />
                        {errors.linkName && (
                          <Text
                            css={css`
                              font-size: 14px;
                              color: ${SemanticColor.Status.Alert};
                            `}
                          >
                            {errors.linkName.message as string}
                          </Text>
                        )}
                      </Flex>
                      <Flex direction="column" gap="3">
                        <Text>링크 설명</Text>
                        {/* linkDto.linkDesc */}
                        <TextArea
                          size="3"
                          placeholder="링크 설명을 입력해주세요"
                          {...register("linkDesc")}
                        />
                        {errors.linkDesc && (
                          <Text
                            css={css`
                              font-size: 14px;
                              color: ${SemanticColor.Status.Alert};
                            `}
                          >
                            {errors.linkDesc.message as string}
                          </Text>
                        )}
                        <Text
                          css={css`
                            font-size: 14px;
                          `}
                          align={"right"}
                        >
                          {watchLinkDesc?.length ?? 0}/400
                        </Text>
                      </Flex>
                    </VStack>
                  </VStack>
                </Form.Root>
                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <BaseButton
                      size={"2"}
                      className="w-fit"
                      onClick={resetModal}
                      backgroundColor={PaletteColor.Gray[200]}
                    >
                      취소
                    </BaseButton>
                  </Dialog.Close>
                  <Dialog.Close>
                    <BaseButton
                      size={"2"}
                      className="w-fit"
                      onClick={handleSubmit(submit)}
                      backgroundColor={
                        isValid
                          ? SemanticColor.Primary.Default
                          : PaletteColor.Gray[200]
                      }
                    >
                      확인
                    </BaseButton>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
            {toast.render()}
          </>
        )
      : () => <></>,
  };
};

export default useBookmarkAddDetailModal;
