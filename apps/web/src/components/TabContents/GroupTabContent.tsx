import { css } from "@emotion/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Text } from "@radix-ui/themes";

import { ArcaveCard } from "@arcave/components/common/ArcaveCard";
import Button from "@arcave/components/common/Button/Button";
import HStack from "@arcave/components/common/Stack/HStack";
import VStack from "@arcave/components/common/Stack/VStack";
import useAPIGroup from "@arcave/services/external/useAPIGroup";
import { SemanticColor } from "@arcave/utils/color";
import { Typography } from "@arcave/utils/typography";

import useGroupAddModal from "../Modal/useGroupAddModal";

type Props = {};

const GroupTabContent = ({ currentUser }: Props) => {
  const groupAddModal = useGroupAddModal();
  const { groups } = useAPIGroup();

  const hasGroups = groups?.length > 0;
  return (
    <>
      <HStack width="100%" justify={"space-between"} className="my-5">
        <div
          css={css`
            ${Typography.Title2[17].Regular}
          `}
        >
          총
          <Text
            css={css`
              color: ${SemanticColor.Primary.Default};
            `}
          >
            {` ${hasGroups ? groups.length : 0} `}
          </Text>
          개의 그룹
        </div>
        <Button size={"2"} className="w-fit" onClick={groupAddModal.show}>
          그룹 추가하기 {<PlusIcon />}
        </Button>
      </HStack>
      {hasGroups ? (
        <HStack
          gap={"5"}
          className={"flex-wrap"}
          css={css`
            width: 1224px;
          `}
        >
          {groups?.map(
            ({
              groupId,
              groupName,
              groupDesc,
              imgUrl,
              categories,
              isGroupPublic,
            }) => {
              const handleClickModify = () => {
                groupAddModal.show({
                  groupName,
                  groupId,
                  groupDescription: groupDesc,
                  groupIsPrivate: isGroupPublic,
                  groupCategories: categories,
                });
              };

              return (
                <ArcaveCard
                  key={groupId}
                  title={groupName}
                  description={groupDesc}
                  groupTitle={categories}
                  imgSrc={imgUrl}
                  url={`/mycave/group/${groupId}`}
                  onClickModify={handleClickModify}
                />
              );
            },
          )}
        </HStack>
      ) : (
        <VStack
          width={"100%"}
          align={"center"}
          justify={"center"}
          className="h-60"
        >
          <Text
            css={css`
              ${Typography.Title1[20].Regular}
            `}
            align={"center"}
          >
            그룹이 없습니다. <br />
            우측 버튼을 눌러서 추가하세요
          </Text>
        </VStack>
      )}
      {groupAddModal.render()}
    </>
  );
};

export default GroupTabContent;
