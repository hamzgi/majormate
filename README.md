# MajorMate 데모

컴퓨터공학과 학생을 위한 전공 커뮤니티 및 조건 기반 스터디 매칭 서비스의 프런트엔드 데모입니다.

## 이번 데모에서 구현한 범위

- Next.js App Router 기반 홈, 커뮤니티, 스터디, MY 페이지
- 커뮤니티 글 목록/검색/카테고리 필터, 글 작성, 상세 보기, 댓글 작성
- 과목·요일·진행 방식·모집 상태 기반 스터디 필터
- 스터디 모집글 작성, 상세 보기, 참여 신청
- MY 페이지에서 내 신청 내역과 그룹장의 신청 승인·거절 흐름
- React의 기본 텍스트 렌더링을 사용해 사용자 입력을 HTML로 삽입하지 않는 안전한 데모 UI

## 이번 데모에서 제외한 범위

- 회원가입·로그인 및 실제 세션 처리
- MongoDB/Mongoose와 서버 액션/Route Handler
- 실제 다중 사용자 데이터 동기화, 권한 검증, 자동 모집 마감
- Rate limiting, 보안 헤더, 취약점 재현용 별도 실습 환경

## 실행

```powershell
cd "C:\Users\bagh0\Desktop\웹보안팀플\majormate"
npm.cmd run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 1단계: 계정 기능 설정

이번 단계에서는 MongoDB Atlas와 Auth.js 기반의 이메일 회원가입, 로그인, 로그아웃, 보호된 MY 페이지를 구현했습니다. 비밀번호는 bcrypt 해시로만 저장하며, 세션은 Auth.js JWT로 관리합니다.

1. `.env.example`을 참고해 프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 입력합니다.
   - `MONGODB_URI`: Atlas에서 만든 데이터베이스 연결 문자열
   - `AUTH_SECRET`: `npx auth secret` 또는 안전한 32바이트 이상의 난수로 만든 비밀값
2. MongoDB Atlas Network Access에서 개발 환경 또는 Vercel의 서버리스 함수가 연결할 수 있도록 설정합니다.
3. Vercel 프로젝트의 **Settings → Environment Variables**에도 같은 두 변수를 등록한 뒤 재배포합니다.

`.env.local`과 연결 문자열, 비밀값은 Git에 올리면 안 됩니다. 환경 변수가 아직 등록되지 않은 배포에서는 로그인·회원가입 대신 준비 안내 화면이 표시되므로, 공개 데모 홈 화면은 계속 정상 동작합니다.
