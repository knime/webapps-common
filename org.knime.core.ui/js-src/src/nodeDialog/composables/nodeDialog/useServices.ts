import {
  AlertingService,
  DialogService,
  JsonDataService,
  SharedDataService,
  type UIExtensionService,
} from "@knime/ui-extension-service";

/**
 * A composable for initializing and accessing the @knime/ui-extension-service stores of the NodeDialog.
 */
export default (baseService: UIExtensionService) => {
  const jsonDataService = new JsonDataService(baseService);
  const dialogService = new DialogService(baseService);
  const sharedDataService = new SharedDataService(baseService);
  const alertingService = new AlertingService(baseService);

  return {
    jsonDataService,
    dialogService,
    sharedDataService,
    alertingService,
  };
};
