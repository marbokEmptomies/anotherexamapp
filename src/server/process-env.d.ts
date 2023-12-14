declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined
        PORT: string;
        SECRET_KEY: string;
        SALT_ROUNDS: string;
        // add more environment variables and their types here
      }
    }
  }

export {}