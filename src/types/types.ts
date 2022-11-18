/**
 * Options object used to configure the SynBioNet API.
 *
 * @public
 */
export interface SynBioNetSettings {
  /**
   * user wallet client. metamask or brave wallet. passed in as window.ethereum. for webui
   */
  ethereumClient?: any;

  /**
   * Optional URL endpoint to use for all requests.
   * This field is useful for testing or for using a custom node endpoint.
   */
  url?: string;
}
