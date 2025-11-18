# 📁 절대 경로 설정 (Absolute Path Imports)

## ✅ 개요

React 프로젝트에서 파일을 import할 때 `../../../` 같은 복잡한 상대경로 대신,  
`src` 디렉토리를 기준으로 한 **절대경로**를 사용할 수 있습니다.

예시:

```js
// ❌ 기존
import Home from '../../../components/user/pages/Home';

// ✅ 절대 경로 적용 후
import Home from 'components/user/pages/Home';
```

## 💡 사용 규칙

| 구분                 | 예시                                             | 설명                     |
| -------------------- | ------------------------------------------------ | ------------------------ |
| 외부 라이브러리      | `import 'bootstrap/dist/css/bootstrap.min.css';` | 그대로 유지              |
| 같은 폴더 내 파일    | `import './Sidebar.css';`                        | 상대경로 그대로 사용     |
| `src` 하위 폴더 파일 | `import 'components/admin/layouts/Sidebar';`     | 절대경로 사용 가능       |
| 전역 스타일          | `import 'styles/global.css';`                    | 절대경로로 불러오기 권장 |

---

## 🚀 장점

-   복잡한 `../` 경로 제거
-   폴더 구조 변경 시 유지보수 용이
-   import 경로 일관성 확보

---

이 설정 이후에는 모든 import가 `src` 폴더를 기준으로 인식됩니다.  
즉, `src/components/...`, `src/styles/...` 같은 경로는  
그냥 `components/...`, `styles/...` 로 접근할 수 있습니다 ✅

---

## 🗂️ 디렉터리 구조

```
routy-front/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── components/
│   │   ├── admin/
│   │   │   ├── index.js
│   │   │   ├── store.js
│   │   │   ├── layouts/
│   │   │   │   ├── SideBar.js
│   │   │   │   └── Sidebar.css
│   │   │   ├── orders/
│   │   │   │   ├── OrderList.js
│   │   │   │   ├── OrderListItem.js
│   │   │   │   └── OrderDetail.js
│   │   │   ├── AdminHome.js
│   │   │   └── Adminhome.css
│   │   ├── common/
│   │   │   └── LoadingSpinner.js
│   │   └── user/
│   │       ├── index.js
│   │       ├── layouts/
│   │       │   └── Header.js
│   │       └── pages/
│   │           └── Home.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── jsconfig.json
├── package-lock.json
├── package.json
└── README.md
```
