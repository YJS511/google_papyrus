// 이 파일은 Vite 프로젝트에서 사용되는 환경변수 타입을 정의합니다.
// 타입 안전성을 위해 VITE_로 시작하는 사용자 정의 환경변수를 명시적으로 선언합니다.

/// <reference types="vite/client" />

// VITE 환경변수를 위한 타입 정의
interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string // Google API 클라이언트 ID
  readonly VITE_SPREADSHEET_ID: string // Google 스프레드시트 ID
}

// import.meta 객체의 env 속성 타입 정의
interface ImportMeta {
  readonly env: ImportMetaEnv
}
