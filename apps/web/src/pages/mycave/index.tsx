import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Avatar, Flex, Heading, Tabs } from "@radix-ui/themes";
import { useAtom } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

import ARCAVE_LOGO from "@arcave/assets/icons/logo_white.svg";
import Chip from "@arcave/components/Chip";
import Button from "@arcave/components/common/Button/Button";
import ACSkeleton from "@arcave/components/common/Skeleton";
import HStack from "@arcave/components/common/Stack/HStack";
import VStack from "@arcave/components/common/Stack/VStack";
import Layout from "@arcave/components/Layout";
import { NavigationBar } from "@arcave/components/NavigationBar";
import ACTabs from "@arcave/components/Tabs/ACTabs";
import useCurrentUser from "@arcave/hooks/useCurrentUser";
import BookmarkTabAtom from "@arcave/store/BookmarkTabAtom";

import ArcaveTabContent from "../../components/TabContents/ArcaveTabContent";
import GroupTabContent from "../../components/TabContents/GroupTabContent";

export enum BookmarkTab {
  ALL = "아케이브",
  GROUP = "내 그룹",
  SAVED = "북마크한 그룹",
}

enum NavigationBarLeftItem {
  LOGO = "logo",
  FEED = "feed",
  MYCAVE = "mycave",
}

enum NavigationBarRightItem {
  Login = "login",
}

const MycavePage = () => {
  const currentPathname = usePathname();
  const { currentUser } = useCurrentUser();
  const [bookmarkTabValue, setBookmarkTabValue] = useAtom(BookmarkTabAtom);
  const router = useRouter();

  if (!currentUser) {
    return (
      <div
        css={css`
          padding: 12px;
        `}
      >
        <ACSkeleton count={3} />
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <BookmarkLayout>
        <Flex gap="4" className="my-8">
          <Avatar
            src={
              currentUser.imgUrl ??
              `https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop`
            }
            fallback={currentUser.nickname[0] ?? "?"}
            radius="full"
            size="7"
          />
          <VStack className={"my-4"} spacing={4}>
            <Heading size="5">{currentUser.nickname}</Heading>
            <HStack spacing={8}>
              {currentUser.categories.map((category) => (
                <Chip key={category}>{category}</Chip>
              ))}
            </HStack>
          </VStack>
        </Flex>
        <ACTabs
          tabsList={Object.values(BookmarkTab)}
          defaultValue={BookmarkTab.ALL}
          value={bookmarkTabValue as string}
          onValueChange={setBookmarkTabValue}
        >
          <Tabs.Content value={BookmarkTab.ALL}>
            <ArcaveTabContent currentUser={currentUser} />
          </Tabs.Content>
          <Tabs.Content value={BookmarkTab.GROUP}>
            <GroupTabContent />
          </Tabs.Content>
          <Tabs.Content value={BookmarkTab.SAVED}>
            {BookmarkTab.SAVED}
          </Tabs.Content>
        </ACTabs>
      </BookmarkLayout>
    </>
  );
};
export default MycavePage;

const BookmarkLayout = styled(Layout)``;
