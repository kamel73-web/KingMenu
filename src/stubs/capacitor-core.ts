export class WebPlugin {
  constructor() {}

  protected async handleRequest(
    options: any
  ): Promise<any> {
    return options;
  }
}


export function registerPlugin(
  name: string,
  implementations?: any
) {
  return implementations?.web ?? {};
}


export const Capacitor = {
  isNativePlatform: () => false,
  getPlatform: () => 'web',
};
