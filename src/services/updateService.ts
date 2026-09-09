// Versão atual embutida no client deste bundle
export const CURRENT_CLIENT_VERSION = '1.2.0';
export const CURRENT_CLIENT_BUILD = 102;

export interface AppVersionInfo {
  version: string;
  versionCode: number;
  appName: string;
  releaseDate: string;
  minRequiredVersion?: string;
  apkDownloadUrl: string;
  webUrl: string;
  forceUpdate?: boolean;
  title: string;
  message: string;
  changelog: string[];
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  isNativeApp: boolean;
  currentVersion: string;
  latestVersion?: string;
  info?: AppVersionInfo;
  error?: string;
}

export async function checkAppUpdate(): Promise<UpdateCheckResult> {
  const isNativeApp =
    typeof window !== 'undefined' &&
    (window.location.protocol.startsWith('capacitor') ||
      !!(window as any).Capacitor?.isNativePlatform?.());

  try {
    const timestamp = Date.now();
    const res = await fetch(`/api/app/version?_t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    if (!res.ok) {
      return {
        hasUpdate: false,
        isNativeApp,
        currentVersion: CURRENT_CLIENT_VERSION,
        error: `Servidor retornou status ${res.status}`,
      };
    }

    const data: AppVersionInfo = await res.json();

    // Se o código de versão no servidor for maior que o local, há atualização disponível!
    const hasUpdate = data.versionCode > CURRENT_CLIENT_BUILD || data.version !== CURRENT_CLIENT_VERSION;

    return {
      hasUpdate,
      isNativeApp,
      currentVersion: CURRENT_CLIENT_VERSION,
      latestVersion: data.version,
      info: data,
    };
  } catch (err: any) {
    console.warn('Verificação de atualização indisponível no momento:', err.message);
    return {
      hasUpdate: false,
      isNativeApp,
      currentVersion: CURRENT_CLIENT_VERSION,
      error: 'Não foi possível conectar ao servidor de atualização.',
    };
  }
}
