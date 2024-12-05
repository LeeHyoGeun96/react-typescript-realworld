# ![RealWorld Example App](logo.png)

> ### React와 TypeScript로 구현한 실제 애플리케이션으로, [RealWorld](https://github.com/gothinkster/realworld) 스펙과 API를 준수하며 CRUD, 인증, 고급 패턴 등을 포함합니다.

### [데모](https://realworld3397.netlify.app)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

이 프로젝트는 **React와 TypeScript**를 사용하여 CRUD 작업, 인증, 라우팅, 페이지네이션 등을 포함한 완전한 기능을 갖춘 풀스택 애플리케이션을 구현한 것입니다.

React와 TypeScript 커뮤니티의 스타일 가이드와 모범 사례를 최대한 준수하려 노력했습니다.

다른 프론트엔드/백엔드와의 연동 방법에 대한 자세한 내용은 [RealWorld](https://github.com/gothinkster/realworld) 저장소를 참조하세요.

## ✨ 주요 기능

- 사용자 인증 (로그인/회원가입)
- 게시글 작성, 수정, 삭제, 조회
- 댓글 기능
- 게시글 좋아요
- 사용자 프로필
- 다크모드 지원

## 🛠 기술 스택

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query
- Zustand
- React Router DOM
- Axios

## 🏃‍♂️ 시작하기

### 설치

```
# 저장소 클론
git clone [repository-url]

# 의존성 설치
npm install
```

### 개발 서버 실행

```
npm run dev
```

### 빌드

```
npm run build
```

## 📝 사용 가능한 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run lint`: ESLint 실행
- `npm run format`: Prettier로 코드 포맷팅

## 📁 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── hooks/         # 커스텀 훅
├── store/         # 상태 관리
├── api/           # API 관련 로직
├── types/         # TypeScript 타입 정의
└── utils/         # 유틸리티 함수
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고해주세요.

## BackEnd

[RealWorld Backend](https://github.com/LeeHyoGeun96/node-express-prisma-v1-official-app)

해당 레파이토리에서 백엔드 서버를 구축해야 합니다.
실행 시킨 후 .env 파일에서 API 주소를 변경해야 합니다.

## 🔧 환경 설정

프로젝트 실행을 위해 `.env` 파일이 필요합니다. `.env.example` 파일을 참고하여 설정해주세요.
