//informational
const continueInformational: number = 100;
const switchingProtocolInformational: number = 101;
const processingInformational: number = 102;
const earlyHintsInformational: number = 103;

//success
const okSuccess: number = 200;
const resourceCreatedSuccess = 201;

//client errors
const badRequestErrorClient: number = 400;
const unauthorizedErrorClient: number = 401;
const paymentRequiredErrorClient: number = 402;
const noAccessErrorClient: number = 403;
const notFoundErrorClient: number = 404;

//server errors
const internalServerError: number = 500;
const badGatewayErrorServer: number = 502;
const serviceUnavailableErrorServer: number = 503;
const insuffientStorageErrorServer: number = 507;

export {
  continueInformational,
  switchingProtocolInformational,
  processingInformational,
  earlyHintsInformational,
  okSuccess,
  resourceCreatedSuccess,
  badRequestErrorClient,
  noAccessErrorClient,
  notFoundErrorClient,
  unauthorizedErrorClient,
  paymentRequiredErrorClient,
  badGatewayErrorServer,
  internalServerError,
  serviceUnavailableErrorServer,
  insuffientStorageErrorServer,
};
