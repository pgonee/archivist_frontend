/**
 * - 회원가입 관련 페이지입니다
 */
import {NavigationBar,LoginView,SignupView} from "@archivist/ui";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {css} from "@emotion/react";
import ARCAVE_LOGO from "@assets/icons/logo.svg";
import React,{useState,useEffect} from "react";
import styled from "@emotion/styled";
import Layout from "@components/Layout";

enum NavigationBarLeftItem {
  LOGO = "logo",
  FEED = "feed",
}

const SignupPage = ( props ) => {
  const [_,currentPath] = usePathname();

  /** loginView 관련 로직입니다 */
  const [mountedByLoginView, setMountedByLoginView] = useState<boolean>(false);
  useEffect(() => {
    setMountedByLoginView(true);
  }, []);

  /** 회원가입 관련 로직입니다 */

  return (
    <>
      <NavigationBar
        currentPath={currentPath}
        leftItems={{
          [NavigationBarLeftItem.LOGO]: (
            <Link
              href={"/feed"}
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <ARCAVE_LOGO />
            </Link>
          ),
        } }
      />
      <SignupLayout>
        { mountedByLoginView && <LoginView /> }
        <SignupView step={1} />
      </SignupLayout>
    </>
  )
}
export default SignupPage;

const SignupLayout = styled(Layout)``;