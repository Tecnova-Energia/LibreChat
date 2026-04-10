import {
  GoogleIcon,
  FacebookIcon,
  GithubIcon,
  DiscordIcon,
  AppleIcon,
  SamlIcon,
} from '@librechat/client';
import SocialButton from './SocialButton';
import { useLocalize } from '~/hooks';
import { TStartupConfig } from 'librechat-data-provider';
function SocialLoginRender({
  startupConfig,
}: {
  startupConfig: TStartupConfig | null | undefined;
}) {
  const localize = useLocalize();
  if (!startupConfig) {
    return null;
  }
  const providerComponents = {
    discord: startupConfig.discordLoginEnabled && (
      <SocialButton
        key="discord"
        enabled={startupConfig.discordLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="discord"
        Icon={DiscordIcon}
        label={localize('com_auth_discord_login')}
        id="discord"
      />
    ),
    facebook: startupConfig.facebookLoginEnabled && (
      <SocialButton
        key="facebook"
        enabled={startupConfig.facebookLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="facebook"
        Icon={FacebookIcon}
        label={localize('com_auth_facebook_login')}
        id="facebook"
      />
    ),
    github: startupConfig.githubLoginEnabled && (
      <SocialButton
        key="github"
        enabled={startupConfig.githubLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="github"
        Icon={GithubIcon}
        label={localize('com_auth_github_login')}
        id="github"
      />
    ),
    google: startupConfig.googleLoginEnabled && (
      <SocialButton
        key="google"
        enabled={startupConfig.googleLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="google"
        Icon={GoogleIcon}
        label={localize('com_auth_google_login')}
        id="google"
      />
    ),
    apple: startupConfig.appleLoginEnabled && (
      <SocialButton
        key="apple"
        enabled={startupConfig.appleLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="apple"
        Icon={AppleIcon}
        label={localize('com_auth_apple_login')}
        id="apple"
      />
    ),
    openid: startupConfig.openidLoginEnabled && (
      <div key="openid">
        <SocialButton
          enabled={startupConfig.openidLoginEnabled}
          serverDomain={startupConfig.serverDomain}
          oauthPath="openid"
          Icon={() => (
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
          )}
          label="Entrar com Microsoft"
          id="openid"
        />
        <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
          Use sua conta corporativa da Tecnova
          <br />
          para acessar o sistema.
        </p>
      </div>
    ),
    saml: startupConfig.samlLoginEnabled && (
      <SocialButton
        key="saml"
        enabled={startupConfig.samlLoginEnabled}
        serverDomain={startupConfig.serverDomain}
        oauthPath="saml"
        Icon={() =>
          startupConfig.samlImageUrl ? (
            <img src={startupConfig.samlImageUrl} alt="SAML Logo" className="h-5 w-5" />
          ) : (
            <SamlIcon />
          )
        }
        label={startupConfig.samlLabel ? startupConfig.samlLabel : localize('com_auth_saml_login')}
        id="saml"
      />
    ),
  };
  return (
    startupConfig.socialLoginEnabled && (
      <>
        {startupConfig.emailLoginEnabled && (
          <>
            <div className="relative mt-6 flex w-full items-center justify-center border border-t border-gray-300 uppercase dark:border-gray-600">
              <div className="absolute bg-white px-3 text-xs text-black dark:bg-gray-900 dark:text-white">
                Or
              </div>
            </div>
            <div className="mt-8" />
          </>
        )}
        <div className="mt-2">
          {startupConfig.socialLogins?.map((provider) => providerComponents[provider] || null)}
        </div>
      </>
    )
  );
}
export default SocialLoginRender;
