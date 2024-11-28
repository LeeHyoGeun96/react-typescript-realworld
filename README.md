# React + TypeScript RealWorld 프로젝트

## 🚀 프로젝트 소개

이 프로젝트는 RealWorld 스펙을 기반으로 React와 TypeScript를 사용하여 구현한 블로그 플랫폼입니다.

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

## 🔧 환경 설정

프로젝트 실행을 위해 `.env` 파일이 필요합니다. `.env.example` 파일을 참고하여 설정해주세요.
