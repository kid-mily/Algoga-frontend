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
| `docs/작업내용` | 문서 작업 |

## 작성 규칙

- 소문자와 하이픈(-)만 사용, 언더스코어(`_`) 사용 금지
- `feature/역할-작업내용` 형식으로 작성 (예: `feature/content-lecture`, `fix/user-community`)
- 문서 작업은 `docs/작업내용` (예: `docs/release-note`)
- 이슈 번호가 있는 경우: `feature/content-lecture#12` 형식으로 이슈 번호 앞에 하이픈 없이 바로 연결
- 브랜치명은 **영문**으로만 작성
- 역할명 : `user`(사용자), `content`(컨텐츠 매니저), `cs`(CS 매니저), `money`(정산 매니저), `data`(통계매니저), `super`(슈퍼어드민), `common`(공통/여러 역할 걸침)
---

## ✍️ 2. Commit Message 명명 규칙

Conventional Commits 스펙을 기반으로 작성합니다.

## 커밋 메시지 구조

`[type] subject#이슈번호

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
| `docs` | 문서 내용 변경 |
| `Bug` | 배포 후 발견된 긴급 오류 수정 |
| `Publish` | 배포/CI-CD 관련 작업 |

## 작성 규칙

- `subject`는 **50자 이내**, 마침표 없이 작성
- `type`은 대괄호로 감싸고 콜론 없이 바로 `subject` 작성 (예: `[fix] 로그인 수정#465`)
- `subject`는 **한글 또는 영문** 통일하여 작성
- 명령문 형태로 작성 (예: "로그인 기능 추가" O / "로그인 기능을 추가했습니다" X)
- `body`는 **무엇을, 왜** 변경했는지 설명 (어떻게는 코드로 확인 가능)
- `footer`에는 이슈 번호 기재: `Closes #12`, `Refs #34`

## 예시

`[feature] 소셜 로그인 기능 추가#이슈번호

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
| 파일명 (컴포넌트) | PascalCase | `LoginForm.tsx` |
| 파일명 (유틸/훅) | camelCase | `formatDate.ts`, `useModal.ts` |

## TypeScript / React 규칙

- `var` 사용 금지 → `const`, `let`만 사용
- 화살표 함수 사용, 부득이할 경우 일반 함수 사용
- 삼항 연산자는, 중첩 삼항 연사자 사용시에는 주석으로 설명
- `console.log`는 개발 완료 후 주석처리
- `any` 타입 사용 지양, 부득이할 경우 왜 필요한지 주석으로 설명

## CSS / Styling 규칙

- Tailwind CSS 유틸리티 클래스를 사용 (별도 CSS 파일을 만들어 연결하지 않음)
- 반복되는 스타일 조합은 컴포넌트로 분리하거나 `clsx`/템플릿 리터럴로 정리
- 0값에도 단위 표기가 필요한 인라인 스타일(`style={{ margin: 0 }}` 등)에서는 `margin: 0` X / `margin: "0px"` O

---

## 📂 4. 폴더 구조 규칙

Next.js **App Router** + 도메인(feature) 단위 구조를 사용합니다. 전역 상태관리 라이브러리는 사용하지 않습니다.

```
src/
├── app/                 # 라우팅 전용 (page.tsx, layout.tsx, route.ts) — Next.js 파일 기반 라우팅
│   ├── (user)/            # 사용자용 화면 그룹
│   ├── contentadmin/      # 콘텐츠매니저
│   ├── csadmin/           # CS매니저
│   ├── moneyadmin/        # 정산매니저
│   ├── statisticadmin/    # 통계매니저
│   ├── superadmin/        # 슈퍼어드민
│   └── auth/              # 로그인/회원가입
├── features/            # 도메인별 기능 단위
│   └── <도메인>/          # 예: auth, community, contentmanage, csadmin, moneyadmin ...
│       ├── components/      # 해당 도메인 전용 컴포넌트
│       ├── hooks/           # 해당 도메인 전용 커스텀 훅
│       ├── utils/           # 포맷팅, 정규화 등 순수 함수
│       └── types.ts         # 해당 도메인 타입 (규모가 크면 types/ 폴더로 분리)
├── features/services/   # 백엔드 API 연동 서비스 (도메인을 가로지르는 공용 API 호출)
└── lib/                 # 프로젝트 전반에서 쓰는 공용 라이브러리 (api.ts, auth 토큰/쿠키 유틸 등)
```

- 페이지/라우팅 관련 코드만 `src/app`에 두고, 실제 로직(컴포넌트/훅/서비스)은 `src/features`에 작성합니다.
- 여러 도메인에서 공용으로 쓰는 컴포넌트/훅은 `src/features/common`에 둡니다.
- 새 폴더를 어디에 만들지 애매하면 기존 도메인 폴더 구조를 참고합니다.

---

## 🛠️ 5. 개발 환경 & 도구 설정

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package manager**: npm
- **테스트**: Jest(단위/컴포넌트, `unit-tests/`), Playwright(e2e, `tests/`)
- **로컬 실행**: `npm run dev` (포트 17000)
- 환경변수는 `.env.local` 파일로 관리, **절대 git에 push 금지** → `.gitignore`에 추가
- AI 도구(Claude Code, Codex 등) 작업 규칙과 기술 스택 상세는 [`AGENTS.md`](AGENTS.md) 참고

---

## 💬 6. 코드 리뷰 원칙

- 리뷰는 **코드를 비판하되, 사람을 비판하지 않기**
- 수정 제안 시 이유와 대안을 함께 제시
- 칭찬과 긍정적 피드백도 적극 활용

---

## 📌 7. 버전 관리 규칙

> ⚠️ 지금까지는 `package.json` version과 Git Tag를 실제로 갱신하지 않았습니다. **오늘(2026-07-13)부터 아래 규칙을 실제로 적용합니다.** 이전 커밋에는 소급 적용하지 않습니다.

본 프로젝트는 버전 관리를 위해 `MAJOR.MINOR.PATCH` 형식을 사용합니다.

```txt
vMAJOR.MINOR.PATCH
```

예시:

```txt
v1.0.0
v1.1.0
v1.1.1
```

### Version Update 기준

| 유형      | 증가 예시             | 기준                                             |
| ------- | ----------------- | ---------------------------------------------- |
| `MAJOR` | `v1.0.0 → v2.0.0` | 프로젝트 구조 변경, 인증 방식 변경, 기존 API와 호환되지 않는 변경       |
| `MINOR` | `v1.0.0 → v1.1.0` | 새로운 기능 추가, 새로운 화면 추가, 새로운 API 연동, 기존 기능 확장     |
| `PATCH` | `v1.0.0 → v1.0.1` | 버그 수정, UI/CSS 수정, API 오류 수정, 성능 개선, 오타 및 문서 수정 |

---

## 📖 Release Notes

릴리즈 노트는 배포 버전별 변경사항을 기록하기 위한 문서입니다.

개별 기능 PR은 일반 PR 템플릿을 사용하고, 여러 작업이 모여 `develop` 브랜치에서 `main` 브랜치로 배포될 때 릴리즈 전용 PR 템플릿과 릴리즈 노트를 작성합니다.

```txt
feature/* → develop
fix/* → develop
docs/* → develop

develop → main
```

### Release Note 작성 기준

릴리즈 노트는 기능 또는 작업 단위로 작성하며, 변경사항은 아래 항목으로 구분합니다.

* `Added`: 새로 추가된 기능
* `Changed`: 기존 기능, UI, 구조, 로직이 변경된 내용
* `Fixed`: 오류 수정, 버그 해결, 예외 처리 개선

자세한 작성 규칙과 예시는 `.github/release_note_template.md` 파일을 참고합니다.

---

## 🏷 Git Tag

릴리즈가 완료되면 해당 버전에 맞는 Git Tag를 생성합니다.

```bash
git tag v0.0.0
git push origin v0.0.0
```



> 📝 **마지막 업데이트**: 2026.07.13
>
