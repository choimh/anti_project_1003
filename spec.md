# Supabase 책 검색 서비스

## 1. 개요 (Overview)

### 1.1 프로젝트 목적
Supabase를 백엔드로 활용하여 사용자가 책을 검색하고 관리할 수 있는 웹 서비스를 구축합니다.

### 1.2 대상 사용자
- 책을 검색하고 관리하고 싶은 일반 사용자
- 독서 목록을 정리하고 싶은 독서 애호가

### 1.3 핵심 가치
- **빠른 검색**: Supabase의 Full-text Search를 활용한 빠른 책 검색
- **간편한 관리**: 직관적인 UI로 책 추가/수정/삭제
- **실시간 동기화**: Supabase Realtime을 통한 실시간 데이터 업데이트

---

## 2. 기능 요구사항 (Functional Requirements)

### 2.1 핵심 기능
| ID | 기능명 | 설명 | 우선순위 |
|----|--------|------|----------|
| F-001 | 책 검색 | 제목, 저자, ISBN으로 책 검색 | 높음 |
| F-002 | 책 등록 | 새로운 책 정보 추가 | 높음 |
| F-003 | 책 목록 조회 | 등록된 책 목록 보기 | 높음 |
| F-004 | 책 정보 수정 | 기존 책 정보 편집 | 중간 |
| F-005 | 책 삭제 | 등록된 책 삭제 | 중간 |

### 2.2 상세 기능 명세

#### F-001: 책 검색
- **설명**: 사용자가 검색어를 입력하면 책 제목, 저자명에서 매칭되는 결과 표시
- **입력**: 검색어 (문자열)
- **출력**: 매칭되는 책 목록
- **비즈니스 규칙**: 최소 2글자 이상 입력 시 검색 실행
- **예외 처리**: 결과 없을 시 "검색 결과 없음" 메시지

#### F-002: 책 등록
- **설명**: 새로운 책 정보를 데이터베이스에 추가
- **입력**: 제목(필수), 저자(필수), ISBN, 출판사, 출판년도, 설명
- **출력**: 등록 성공/실패 메시지
- **비즈니스 규칙**: 제목과 저자는 필수 입력

---

## 3. 비기능 요구사항 (Non-Functional Requirements)

### 3.1 성능 요구사항
- 응답 시간: 검색 결과 2초 이내 표시
- 동시 사용자 수: 100명 (Supabase Free Tier 기준)

### 3.2 보안 요구사항
- Supabase Row Level Security (RLS) 적용
- API 키 환경 변수로 관리

---

## 4. 기술 스택 (Tech Stack)

### 4.1 프론트엔드
- HTML5, CSS3, JavaScript (Vanilla)
- 반응형 디자인

### 4.2 백엔드
- Supabase (PostgreSQL + REST API)
- Supabase JavaScript Client

### 4.3 데이터베이스
- PostgreSQL (Supabase 제공)

---

## 5. 데이터 모델 (Data Model)

### 5.1 주요 엔티티
```
books
├── id: UUID (PK, auto-generated)
├── title: VARCHAR(255) NOT NULL
├── author: VARCHAR(255) NOT NULL
├── isbn: VARCHAR(20)
├── publisher: VARCHAR(255)
├── published_year: INTEGER
├── description: TEXT
├── cover_url: TEXT
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```

---

## 6. UI/UX 설계 (UI/UX Design)

### 6.1 화면 목록
| ID | 화면명 | 설명 |
|----|--------|------|
| S-001 | 메인/검색 화면 | 검색바 + 책 목록 그리드 |
| S-002 | 책 등록 모달 | 새 책 정보 입력 폼 |
| S-003 | 책 상세 모달 | 책 상세 정보 및 수정/삭제 |

### 6.2 디자인 컨셉
- 모던하고 깔끔한 UI
- 다크모드 지원
- 카드형 책 목록 레이아웃

---

## 7. 마일스톤 (Milestones)

| 단계 | 목표 | 예상 기간 |
|------|------|-----------|
| Phase 1 | MVP - 책 검색/등록/조회 | 1일 |
| Phase 2 | 수정/삭제 + UI 개선 | 0.5일 |

---

## 변경 이력 (Change Log)

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 0.1 | 2026-01-12 | 초안 작성 | AI Assistant |
