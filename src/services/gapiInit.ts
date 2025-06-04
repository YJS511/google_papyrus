// 이 파일은 Google API 클라이언트를 초기화하고 Google 계정 로그인을 처리하는 함수 gapiInit을 제공합니다.
// Google Sheets API에 접근하기 위해 필요한 설정과 인증 과정을 포함하고 있습니다.
import { gapi } from 'gapi-script'

declare global {
    namespace gapi {
        namespace client {
            function init(params: {
                clientId: string;
                discoveryDocs: string[];
                scope: string;
            }): Promise<void>;
            namespace drive {
                namespace files {
                    function list(params: {
                        q: string;
                        fields: string;
                        spaces: string;
                        orderBy: string;
                    }): Promise<{ result: { files: Array<{ id: string; name: string }> } }>;
                }
            }
        }
        namespace auth2 {
            function getAuthInstance(): {
                signIn(): Promise<any>;
                isSignedIn: {
                    listen: (listener: (isSignedIn: boolean) => void) => void;
                };
            };
        }
        function load(api: string, callback: () => void): void;
    }
}

// Google API 클라이언트를 초기화하고 사용자에게 로그인 요청을 수행하는 함수
export const gapiInit = async (clientId: string) => {
    return new Promise<void>((resolve, reject) => {
        gapi.load('client:auth2', async () => {
            try {
                await gapi.client.init({
                    clientId,
                    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly',
                    discoveryDocs: [
                        'https://sheets.googleapis.com/$discovery/rest?version=v4',
                        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
                    ]
                })

                // Silent Authentication 설정
                const auth2 = gapi.auth2.getAuthInstance()
                auth2.isSignedIn.listen((isSignedIn) => {
                    if (isSignedIn) {
                        console.log('사용자가 로그인되었습니다.')
                    }
                })

                resolve()
            } catch (error) {
                reject(error)
            }
        })
    })
}
