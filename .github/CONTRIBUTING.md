# 🤝 Contributing to Routy

Routy 프로젝트에 기여해 주셔서 감사합니다!
모든 협업자는 아래의 브랜치 규칙과 워크플로우를 따라주세요.

---

## 🌿 브랜치 구조

| 브랜치 | 용도 | 비고 |
|--------|------|------|
| `main` | 🚀 배포용 (항상 안정 상태) | 직접 push 금지 (보호 브랜치) |
| `develop` | 🧩 기본 개발 브랜치 | feature 브랜치 병합 대상 |
| `feature/*` | ✏️ 기능 개발용 | 예: `feature/login`, `feature/header-ui` |
| `fix/*` / `hotfix/*` | 🐞 버그 수정용 | 긴급 수정은 `hotfix`로 생성 |

---

## ⚙️ 기본 규칙

1. **기본 브랜치**는 `develop`입니다. 새로 클론하면 자동으로 `develop`이 활성화됩니다.
2. 모든 개발은 `feature/*` 브랜치에서 진행하세요.
3. `main` 브랜치에는 직접 push하지 마세요. `develop → main` PR만 허용됩니다.
4. PR은 반드시 **리뷰 승인 + CI 통과 후 병합(Squash merge)** 해야 합니다.

---

## 🔧 개발 흐름 (Git Flow)

```bash
# 1️⃣ develop 최신화
git checkout develop
git pull

# 2️⃣ 새 기능 브랜치 생성
git checkout -b feature/<기능명>

# 3️⃣ 작업 및 커밋
git add .
git commit -m "feat: 기능 설명"

# 4️⃣ 원격에 푸시
git push -u origin feature/<기능명>

# 5️⃣ GitHub에서 PR 생성 (feature → develop)
```
> PR 제목 예시: `feat: 로그인 페이지 구현 (#12)` / `fix: 회원가입 유효성 검사 추가 (#17)`

---

## 🧪 릴리스 (Release)

1. `develop`에서 테스트 완료 후 `main`으로 PR 생성 (base: `main`, compare: `develop`)
2. 리뷰 & CI 통과 후 **Squash Merge**
3. 버전 태그 추가
```bash
git checkout main
git pull
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

---

## 🧭 커밋 컨벤션

| 타입 | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `chore` | 빌드/환경/문서 등 변경 |
| `refactor` | 리팩토링(기능 변경 없음) |
| `style` | 포맷 수정(로직 변경 없음) |
| `docs` | 문서 수정 |

예시:
- `feat: 메인 페이지 Header 컴포넌트 추가`
- `fix: 로그인 토큰 만료 시 자동 로그아웃 처리`

---

## 🧱 PR 머지 방식

- Routy는 **Squash Merge**를 기본으로 사용합니다. (여러 커밋을 하나로 압축)
- **Merge commit은 사용하지 않습니다.**
- Rebase merge는 숙련자만 선택적으로 사용 가능합니다.

---

## 🧩 긴급 수정 (Hotfix)

```bash
# 1️⃣ main에서 분기
git checkout main
git pull
git checkout -b hotfix/<이슈명>

# 2️⃣ 수정 및 푸시
git add .
git commit -m "hotfix: 긴급 수정 내용"
git push -u origin hotfix/<이슈명>

# 3️⃣ PR 생성 (hotfix → main)
# 4️⃣ main에 병합 후 develop에도 반영(PR: main → develop)
```

---

## 📜 주의사항

- 모든 PR은 **CI 통과 + 리뷰 승인 1회 이상** 필요
- `main`은 **배포용 브랜치**이므로 직접 커밋 금지
- 긴급 수정(`hotfix`)은 `main`에 머지 후 **반드시 `develop`에 재병합**

---

감사합니다 🙌
`main`은 안정성을, `develop`은 생산성을 지향합니다.
함께 좋은 코드 문화를 만들어가요.
