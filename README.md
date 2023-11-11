
# Archivist_frontend

- Archivist 레포입니다


- 현재 turbo 로 관리하는 MonoRepo 입니다



### dependencies
````
  - pnpm : 8.10.2
  - node : 18.17.0
  - turbo : 1.10.16
````

- 원하는 package 에 추가하고 싶다면 아래 명령어를 통해 추가할 수 있습니다
````shell
pnpm add --filter <MONOREPO_PACHAGE_NAME> <NODE_PACKAGE_NAME>
````

---

### How to Install

- 만약 pnpm 을 설치하지 않으셨다면 pnpm 부터 설치해주세요

````shell
# pnpm 같은 패키지매니져는 전역으로 설치를 권장합니다
npm install -g pnpm
````

- 그 후, 최상위 패키지에서 아래 명령어를 입력해주세요

````shell
# 각종속성 패키지들을 설치해주세요!
pnpm install
````

- 메인 실행은 dev 명령어를 이용하여 띄울 수 있습니다!

````shell
# 개발 모드로 실행합니다
pnpm run dev
````

---

### Docs

- 각 패키지별 자세한 설명은 패키지란에 설명해두었습니다


- [ Archivist ]( apps/web/README.md )
- [ UI ]( packages/ui/README.md )
- [ Types ]( packages/types/README.md )
- [ Config ]( packages/config/README.md )
