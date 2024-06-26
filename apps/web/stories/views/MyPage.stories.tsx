import MyPage from "@arcave/components/views/MyPage";
import { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof MyPage>;

const meta: Meta<typeof MyPage> = {
  component: MyPage,
  args: {
    categories: [
      "카테고리1",
      "카테고리2",
      "카테고리3",
      "카테고리4",
      "카테고리5",
      "카테고리6",
    ],
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default: Story = {
  args: {},
};
