# Papyrus - 구글 시트 데이터 조회 애플리케이션

Papyrus는 구글 시트의 데이터를 쉽게 조회하고 관리할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- 구글 스프레드시트 목록 조회
- 스프레드시트 내 시트 목록 조회
- 선택한 시트의 데이터 테이블 형식으로 표시
- 데이터 필터링, 정렬, 페이지네이션 지원

## 기술 스택

- React
- TypeScript
- Vite
- Google Sheets API
- Google Drive API

## 시작하기

### 필수 조건

- Node.js (v14 이상)
- npm 또는 yarn
- Google Cloud Platform 프로젝트
- Google Sheets API 및 Drive API 활성화
- OAuth 2.0 클라이언트 ID

### 설치

1. 저장소 클론
```bash
git clone [repository-url]
cd papyrus
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
# Google OAuth 2.0 클라이언트 ID
VITE_CLIENT_ID=your_google_client_id
```

클라이언트 ID는 Google Cloud Console에서 다음과 같이 얻을 수 있습니다:
1. [Google Cloud Console](https://console.cloud.google.com)에 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. "API 및 서비스" > "사용자 인증 정보" 메뉴로 이동
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID" 선택
5. 애플리케이션 유형을 "웹 애플리케이션"으로 선택
6. 승인된 자바스크립트 원본에 `http://localhost:5173` 추가
7. 생성된 클라이언트 ID를 `.env` 파일의 `VITE_CLIENT_ID` 값으로 설정

4. 개발 서버 실행
```bash
npm run dev
```

## 프로젝트 구조

```
src/
├── App.tsx              # 메인 애플리케이션 컴포넌트
├── App.css              # 스타일시트
├── services/
│   ├── gapiInit.ts      # Google API 초기화
│   └── sheetsService.ts # 구글 시트 관련 API 서비스
└── ...
```

## 주요 컴포넌트 설명

### App.tsx
- 메인 애플리케이션 컴포넌트
- 구글 API 인증 처리
- 스프레드시트 및 시트 선택 UI
- 데이터 표시 테이블

### sheetsService.ts
구글 시트 API 관련 기능을 제공하는 서비스:
- `listSpreadsheets()`: 접근 가능한 스프레드시트 목록 조회
- `getSheets()`: 선택된 스프레드시트의 시트 목록 조회
- `getSheetData()`: 선택된 시트의 데이터 조회
- `query()`: 데이터 필터링, 정렬, 페이지네이션 기능
- `append()`: 데이터 추가
- `update()`: 데이터 수정
- `delete()`: 데이터 삭제

## 사용 방법

### 기본 사용법

1. 애플리케이션 실행 후 구글 계정으로 로그인
2. 드롭다운에서 원하는 스프레드시트 선택
3. 선택한 스프레드시트의 시트 목록에서 원하는 시트 선택
4. 선택한 시트의 데이터가 테이블 형식으로 표시됨

### 고급 기능 사용법

#### 1. 데이터 조회 및 필터링

```typescript
// 기본 데이터 조회
const data = await sheetsService.getSheetData(spreadsheetId, 'Sheet1!A1:Z1000');

// 필터링, 정렬, 페이지네이션을 포함한 고급 조회
const filteredData = await sheetsService.query(spreadsheetId, 'Sheet1', {
    page: 1,                    // 페이지 번호
    pageSize: 50,               // 페이지당 항목 수
    sortBy: '이름',             // 정렬 기준 컬럼
    sortOrder: 'asc',           // 정렬 방향 (asc/desc)
    filters: [                  // 필터 조건
        {
            column: '이름',      // 필터링할 컬럼
            operator: 'contains', // 연산자
            value: '홍'          // 검색어
        }
    ]
});
```

#### 2. 데이터 추가

```typescript
// 단일 행 추가
await sheetsService.append(spreadsheetId, 'Sheet1', [
    ['홍길동', '30', '서울']
]);

// 여러 행 추가
await sheetsService.append(spreadsheetId, 'Sheet1', [
    ['홍길동', '30', '서울'],
    ['김철수', '25', '부산'],
    ['이영희', '28', '인천']
]);
```

#### 3. 데이터 수정

```typescript
// 특정 범위의 데이터 수정
await sheetsService.update(
    spreadsheetId,
    'Sheet1',
    'A2:C2',  // 수정할 범위
    [['홍길동', '31', '서울']]  // 새로운 데이터
);
```

#### 4. 데이터 삭제

```typescript
// 특정 범위의 데이터 삭제
await sheetsService.delete(
    spreadsheetId,
    'Sheet1',
    'A2:C2'  // 삭제할 범위
);
```

### 주의사항

1. **권한 설정**
   - 구글 클라우드 콘솔에서 필요한 API 권한을 활성화해야 합니다.
   - OAuth 동의 화면에서 필요한 스코프를 설정해야 합니다.

2. **데이터 형식**
   - 모든 데이터는 문자열 배열 형태로 처리됩니다.
   - 날짜, 숫자 등의 특수 형식은 문자열로 변환하여 처리해야 합니다.

3. **에러 처리**
   - API 호출 시 발생할 수 있는 에러에 대한 적절한 처리가 필요합니다.
   - 네트워크 오류, 권한 오류 등을 고려해야 합니다.

## 스타일링

- 반응형 디자인
- 테이블 스타일링
- 드롭다운 메뉴 스타일링
- 로딩 및 에러 상태 표시

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
