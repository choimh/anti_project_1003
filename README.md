# 📚 Supabase Book Search

Supabase를 백엔드로 활용한 책 검색 및 관리 웹 서비스

## 🚀 Quick Start

### 1. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. `js/config.js`에 프로젝트 정보 입력:

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

### 2. 로컬 실행

```bash
npx serve .
# 또는
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속

## ✨ Features

- 📖 책 검색 (제목/저자)
- ➕ 책 등록
- ✏️ 책 정보 수정
- 🗑️ 책 삭제
- 🌙 다크 모드 UI

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL)
- **API**: Supabase JS Client

## 📁 Structure

```
├── index.html          # 메인 페이지
├── css/style.css       # 스타일시트
├── js/
│   ├── config.js       # Supabase 설정
│   ├── supabase-client.js # DB 연동
│   └── app.js          # 앱 로직
└── supabase/
    └── schema.sql      # DB 스키마
```
