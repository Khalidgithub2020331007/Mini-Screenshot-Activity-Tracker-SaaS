import env from '#start/env'
import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'
import { sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthenticators, InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { jwtGuard } from '@maximemrf/adonisjs-jwt/jwt_config'
import { BaseJwtContent, JwtGuardUser } from '@maximemrf/adonisjs-jwt/types'
import User from '../app/models/user.js'

interface JwtContent extends BaseJwtContent {
  email: string
}

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: 'accessTokens',
        model: () => import('../app/models/user.js'),
      }),
    }),
    jwt: jwtGuard({
      tokenName: 'jwt',
      tokenExpiresIn: '7d',
      // if you want to use cookies for the authentication instead of the bearer token (optional)
      useCookies: true,
      provider: sessionUserProvider({
        model: () => import('../app/models/user.js'),
      }),
      // content is a function that takes the user and returns the content of the token, it can be optional, by default it returns only the user id
      content: <T>(user: JwtGuardUser<T>): JwtContent => {
        return {
          userId: user.getId(),
          email: (user.getOriginal() as User).email,
        }
      },
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
