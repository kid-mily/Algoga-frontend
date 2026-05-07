# Algoga-frontend
알고가 프론트엔드입니다
# 📋 키드밀리팀 프론트엔트 프로젝트 코드 컨벤션

> 이 문서는 팀원 모두가 일관된 코드를 작성하고 효율적으로 협업하기 위한 규칙입니다.
> 
> 
> 모든 팀원은 반드시 이 문서를 숙지해 주세요.
> 

---

## 📁 1. Branch 명명 규칙

브랜치는 **역할과 작업 목적**이 명확히 드러나도록 네이밍합니다.[dev](https://dev.to/mochafreddo/mastering-git-commit-message-types-and-git-flow-branch-naming-1lbb)

## 브랜치 구조

| 브랜치명 | 용도 |
| --- | --- |
| `main` | 배포용 최종 브랜치 (직접 push 금지) |
| `develop` | 개발 통합 브랜치 |
| `feature/작업내용` | 새로운 기능 개발 |
| `fix/작업내용` | 버그 수정 |

## 작성 규칙

- 소문자와 하이픈(-)만 사용, 언더스코어(`_`) 사용 금지
- `feature/login-page`, `fix/auth-token-refresh` 처럼 작업 내용을 명확하게 기술
- 역할이 포함될 경우는 카멜케이스로 작성 ex) 학생로그인페이지 :  `feature/stuLogin-page`
- 이슈 번호가 있는 경우: `feature/login-page-#12` 형식으로 연결
- 브랜치명은 **영문**으로만 작성
- 역할명 : user(사용자), contentM (컨텐츠 매니저), csM(cs 매니저),moneyM(정산 매니저),dataM(통계매니저),superAdmin(슈퍼어드민)
---

## ✍️ 2. Commit Message 명명 규칙

Conventional Commits 스펙을 기반으로 작성합니다.

## 커밋 메시지 구조

`[type]: subject#이슈번호

body (선택)

footer (선택)`

## Type 종류

| Type | 설명 |
| --- | --- |
| `feature` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음) |
| `refactor` | 코드 리팩토링 (기능 변경 없음) |
| `test` | 테스트 코드 추가/수정 |
| `design` | UI/UX 디자인 변경 |

## 작성 규칙

- `subject`는 **50자 이내**, 마침표 없이 작성
- `type`은 **소문자**, `subject`는 **한글 또는 영문** 통일하여 작성
- 명령문 형태로 작성 (예: "로그인 기능 추가" O / "로그인 기능을 추가했습니다" X)
- `body`는 **무엇을, 왜** 변경했는지 설명 (어떻게는 코드로 확인 가능)
- `footer`에는 이슈 번호 기재: `Closes #12`, `Refs #34`

## 예시

`[feature]: 소셜 로그인 기능 추가#이슈번호


---

## 💻 3. 코드 작성 규칙

## 공통

- 함수/변수 하나는 **하나의 역할**만 수행
- 주석은 **코드를 설명하지 않고, 이유를 설명**할 것
- 함수 작성시 어떤 역할을 하는지 주석으로 작성할 것

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 변수/함수 | camelCase | `getUserInfo`, `isLoading` |
| 컴포넌트 | PascalCase | `LoginForm`, `UserCard` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| CSS 클래스 | kebab-case | `login-button`, `user-card` |
| 커스텀 훅 | use 접두사 + camelCase | `useFetch`, `useAuth` |
| 파일명 (컴포넌트) | PascalCase | `LoginPage.jsx` |
| 파일명 (유틸/훅) | camelCase | `formatDate.js`, `useModal.js` |

## JavaScript / React 규칙

- `var` 사용 금지 → `const`, `let`만 사용
- 화살표 함수 사용, 부득이할 경우 일반 함수 사용
- 삼항 연산자는, 중첩 삼항 연사자 사용시에는 주석으로 설명
- `console.log`는 개발 완료 후 주석처리

## CSS / Styling 규칙

- CSS 파일 연결해서 사용
- 0값에는 단위 표기: `margin: 0` X / `margin: 0px` O

---

## 📂 4. 폴더 구조 규칙

`src/
├── assets/      # 이미지, 폰트 등 정적 파일
├── layouts/       # 화면 레이아웃 관리
├── components/    # 공용 컴포넌트
├── pages/         # 페이지 단위 컴포넌트
├── hooks/         # 커스텀 훅
├── services/      # API 호출 로직
├── store/         # 전역 상태 관리
├── styles/        # 스타일
├── routes/       # 화면 연결 관리`

---

## 🛠️ 5. 개발 환경 & 도구 설정

- React (Vite 도구)
- 환경변수는 `.env` 파일로 관리, **절대 git에 push 금지** → `.gitignore`에 추가

---

## 💬 6. 코드 리뷰 원칙

- 리뷰는 **코드를 비판하되, 사람을 비판하지 않기**
- 수정 제안 시 이유와 대안을 함께 제시
- 칭찬과 긍정적 피드백도 적극 활용

---

> 📝 **마지막 업데이트**: 2026.05.06
>
